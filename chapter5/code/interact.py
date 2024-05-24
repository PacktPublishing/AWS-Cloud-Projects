import requests
import base64 
import argparse


def analyze_image(url, image):

    with open(image, 'rb') as image_file:
        image_bytes = image_file.read()
        data = base64.b64encode(image_bytes).decode("utf8")
        payload = {"image": data}

    response = requests.post(url, json=payload)
    return response.json()

    
    
def main():
        
        try:
            parser = argparse.ArgumentParser(usage=argparse.SUPPRESS)
            parser.add_argument("url", help="The url of your API Gateway")
            parser.add_argument("image", help="The local image that you want to analyze.")
            args = parser.parse_args()
            
            result = analyze_image(args.url, args.image)
            status = result['statusCode']

            if status == 200:
                print(result['body']) 
            else:
                print(f"Error: {result['statusCode']}")
                print(f"Message: {result['body']}")
        except Exception as error:
            print("Error: ")
            print(error)
            print("Please check your arguments.")
            print("Usage: python interact.py <url> <image>")

if __name__ == "__main__":
    main()


