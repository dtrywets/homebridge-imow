from quart import Quart, request, jsonify, abort
import asyncio
from imow.api import IMowApi
from imow.common.actions import IMowActions
from datetime import datetime

app = Quart(__name__)
mow_api = IMowApi()

def parse_date(date_str):
    try:
        return datetime.fromisoformat(date_str).isoformat()
    except Exception:
        return date_str

@app.route('/register', methods=['POST'])
async def register():
    data = await request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        abort(400, description="Email and password required")
    try:
        token, expire_time = await mow_api.get_token(email, password, return_expire_time=True)
        return jsonify({'token': token, 'expires': expire_time.isoformat()})
    except Exception as e:
        abort(401, description=str(e))

@app.route('/mowers', methods=['GET'])
async def get_mowers():
    try:
        mowers = await mow_api.receive_mowers()
        mowers_list = []
        for mower in mowers:
            mower_state = await mow_api.get_status_by_id(mower.id)
            mowers_list.append({
                'id': mower.id,
                'name': mower.name,
                'status': mower_state.get('mainState', 'unknown'),
                'battery_level': mower_state.get('chargeLevel'),
                'last_contact': parse_date(mower_state.get('lastSeenDate')),
                'position': parse_date(mower_state.get('lastGeoPositionDate'))
            })
        return jsonify(mowers_list)
    except Exception as e:
        abort(500, description=str(e))

@app.route('/mower/<id>/status', methods=['GET'])
async def get_mower_status(id):
    try:
        status = await mow_api.get_status_by_id(id)
        return jsonify(status)
    except Exception as e:
        abort(404, description=str(e))

@app.route('/mower/<id>/action', methods=['POST'])
async def mower_action(id):
    data = await request.get_json()
    action = data.get('action')
    params = data.get('params', {})
    try:
        if action == "start":
            response = await mow_api.intent(IMowActions.START_MOWING, mower_id=id, **params)
        elif action == "edge":
            response = await mow_api.intent(IMowActions.EDGE_MOWING, mower_id=id, **params)
        elif action == "dock":
            response = await mow_api.intent(IMowActions.TO_DOCKING, mower_id=id, **params)
        else:
            raise ValueError("Invalid action")
        return jsonify({'response': 'Action executed'})
    except Exception as e:
        abort(400, description=str(e))

@app.route('/mower/<id>/settings', methods=['PUT'])
async def update_settings(id):
    data = await request.get_json()
    try:
        mower_state = await mow_api.update_setting(id, **data)
        return jsonify({
            'id': mower_state.id,
            'settings_updated': True
        })
    except Exception as e:
        abort(400, description=str(e))

if __name__ == '__main__':
    app.run(debug=False)
