from socketTest import MySocketIOClient


server_url = 'https://2002-2409-40c0-105d-7901-892d-fe7-7b71-9117.ngrok-free.app/'
my_client = MySocketIOClient(server_url)
print(my_client)
my_client.start()