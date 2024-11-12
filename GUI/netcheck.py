import requests

def internet():
# initializing URL
    url = "https://www.geeksforgeeks.org"
    timeout = 10
    try:
        # requesting URL
        request = requests.get(url,timeout=timeout)

        return True
    # catching exception
    except (requests.ConnectionError,
            requests.Timeout) as exception:
        return False