import json
import random
import string
import time
import boto3
import signal
import numpy as np
import datetime

# Create a client for AWS Systems Manager
ssm = boto3.client('ssm')

# Retrieve the value of the parameter containing the bucket_name
parameter_name = 'clickstream_bucket'
response = ssm.get_parameter(Name=parameter_name)
bucket_name = response['Parameter']['Value']
number_of_events_per_request = 20
# Set up AWS S3 client
s3 = boto3.client('s3')


countries_samples = {
                    '1': 0.07,
                    '2': 0.005,
                    '3': 0.01,
                    '4': 0.03,
                    '5': 0.03,
                    '6': 0.005,
                    '7': 0.02,
                    '8': 0.01,
                    '9': 0.01,
                    '10': 0.01,
                    '11': 0.01,
                    '12': 0.02,
                    '13': 0.005,
                    '14': 0.01,
                    '15': 0.005,
                    '16': 0.02,
                    '17': 0.02,
                    '18': 0.01,
                    '19': 0.02,
                    '20': 0.03,
                    '21': 0.01,
                    '22': 0.02,
                    '23': 0.01,
                    '24': 0.02,
                    '25': 0.01,
                    '26': 0.03,
                    '27': 0.01,
                    '28': 0.005,
                    '29': 0.02,
                    '30': 0.01,
                    '31': 0.02,
                    '32': 0.005,
                    '33': 0.01,
                    '34': 0.02,
                    '35': 0.03,
                    '36': 0.01,
                    '37': 0.005,
                    '38': 0.03,
                    '39': 0.005,
                    '40': 0.02,
                    '41': 0.02,
                    '42': 0.01,
                    '43': 0.01,
                    '44': 0.005,
                    '45': 0.03
                    }


# Define event types and their probabilities
event_types = {
    'click': 0.6,
    'search': 0.3,
    'purchase': 0.1
}

# Define user actions and their probabilities
user_actions = {
    'home_page': 0.2,
    'product_page': 0.4,
    'cart_page': 0.2,
    'checkout_page': 0.1,
    'search_page': 0.1
}

# Define product categories and their probabilities
product_categories = {
    'electronics': 0.3,
    'clothing': 0.2,
    'books': 0.2,
    'home_appliances': 0.1,
    'toys': 0.1,
    'other': 0.1
}


# Function to generate random strings
def random_string(length):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))


# Function to generate normally distributed ages
def generate_age():
    mean = 35  # Mean age
    std_dev = 10  # Standard deviation
    age = np.random.normal(mean, std_dev)
    age = int(age)  # Convert the scalar value to an integer
    age = max(16, min(80, age))  # Clamp age between 16 and 80
    return age


def generate_timestamp():
    today = datetime.datetime.now()
    start_date = today - datetime.timedelta(days=60)
    random_date = start_date + (today - start_date) * random.random()
    return int(random_date.timestamp())


# Function to generate events
def generate_event():
    # Choose event type based on probabilities
    event_type = random.choices(list(event_types.keys()), weights=list(event_types.values()))[0]

    # Choose user action based on probabilities
    user_action = random.choices(list(user_actions.keys()), weights=list(user_actions.values()))[0]

    # user location
    user_location = random.choices(list(countries_samples.keys()), weights=list(countries_samples.values()))[0]

    # Generate random age between 16 and 80
    age = generate_age()

    # Choose product category based on probabilities (if applicable)
    if event_type == 'click' or event_type == 'purchase':
        product_category = random.choices(list(product_categories.keys()), weights=list(product_categories.values()))[0]
    else:
        product_category = None

    # Generate event data
    event_data = {
        'event_type': event_type,
        'user_id': random_string(10),
        'user_action': user_action,
        'product_category': product_category,
        'location': user_location,
        'user_age': age,
        'timestamp': generate_timestamp()
    }

    return event_data


# Function to upload event to S3
def upload_event_to_s3(event_data):
    event_filename = f"{event_data['event_type']}_{event_data['user_id']}_{event_data['timestamp']}.json"
    s3.put_object(
        Bucket=bucket_name,
        Key="raw/"+event_filename,
        Body=json.dumps(event_data).encode('utf-8')
    )
    print(f"Event uploaded to S3: {event_filename}")


# Function to handle timeout
def timeout_handler(signum, frame):
    print(f"Timeout occurred. Exiting script after creating {number_of_events_per_request} events.")
    exit(0)


# Set timeout
signal.signal(signal.SIGALRM, timeout_handler)
signal.alarm(number_of_events_per_request)

# Main loop to generate and upload events
while True:
    event_data = generate_event()
    print(event_data)
    upload_event_to_s3(event_data)
    time.sleep(1)  # Adjust the delay between events as needed
