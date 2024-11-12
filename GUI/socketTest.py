import socketio
import time

class MySocketIOClient:
    def __init__(self, server_url):
        self.sio = socketio.Client()
        self.server_url = server_url

        # Register event handlers
        self.conn = None
        self.data= None
        self.sio.on('*', self.catch_all)
        self.sio.event(self.connect)
        self.sio.event(self.disconnect)
        self.sio.event(self.servermessage)
        t1=self.sio.event(self.alert)
        print(t1)


    def connect(self):
        print('Connected to server')

    def catch_all(self, event, data):
        print(f'Received event: "{event}" with data: {data}')
        # Add your custom logic here based on the received event

    def alert(self, data):
        self.data= data
        #print(f'Received alert: {self.data}')
        self.conn =True
    

    def servermessage(self, data):
        print(data)

    def disconnect(self):
        print('Disconnected from server')

    def start(self):
        self.sio.connect(self.server_url)
    def reset_alert_data(self):
        self.data =None

    def return_data(self):
        return self.data
    

        # Perform actions after connecting
        # self.emit_alert_after_delay()

        # Keep the script running



# Example usage:
