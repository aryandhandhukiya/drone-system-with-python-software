import requests          
def send_emergency_mail():
    x = requests.get('http://10.12.4.128:4000/api/disaster/emergency_mail/8')  

send_emergency_mail()