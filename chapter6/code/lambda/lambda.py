import re


def handler(event, context):
    request = event['Records'][0]['cf']['request']
    
    viewerCountry = request['headers'].get('accept-language')
    if viewerCountry:
        countryCode = viewerCountry[0]['value']
        if re.match(r'^es', countryCode):
            domainName = "my-spanish-assets-bucket.s3.us-east-1.amazonaws.com"
            request['origin']['s3']['domainName'] = domainName
            request['headers']['host'] = [{'key': 'host', 'value': domainName}]
    
    return request
