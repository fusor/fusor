#!/usr/bin/env python

"""
Usage: 
    clean_environment.py [username] [password] [base url]
"""
import sys
import json
try:
    import requests
except Exception:
    print 'You must have the python requests module installed to use this script'
    exit(1)
from requests.packages.urllib3.exceptions import InsecureRequestWarning
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

# Fill these in if you don't want prompts
username=''
password=''
base_url = ''

prompt = True

# Route, number pairs where the number is an ID to stop deleting
# (Anything with an id < that number will not be deleted)
resources = [
    ('fusor/api/v21/deployments',),
    ('api/hosts', 1),
    ('api/hostgroups', 1),
    ('api/puppetclasses', 1)
]

url = 'https://{}:{}@{}'.format(
    username or sys.argv.pop(1) if sys.argv[1:] else raw_input('Username: ').strip(),
    password or sys.argv.pop(1) if sys.argv[1:] else raw_input('Password: '),
    base_url or sys.argv.pop(1) if sys.argv[1:] else raw_input('Base URL for Satellite: ').strip()
)
print 'Using URL {}'.format(url)

def delete_resources(path, start=0):
    response = requests.get('{}/{}'.format(url, path), verify=False).json()

    # reversed in case of dependencies
    ids = reversed(sorted(list(find('id', {'thing': response}))))
    for item in ids:
        if item <= start:
            break
        response = requests.delete('{}/{}/{}'.format(url, path, item), verify=False)
        if response.ok:
            print('{} with id {} deleted'.format(path.split('/')[-1], item))
        else:
            print response.json()


# Thanks Alfe
# http://stackoverflow.com/a/9808122/3768736
def find(key, d):
  for k, v in d.iteritems():
    if k == key:
      yield v
    elif isinstance(v, dict):
      for result in find(key, v):
        yield result
    elif isinstance(v, list):
      for x in v:
        if isinstance(x, dict):
            for result in find(key, x):
              yield result

if __name__ == '__main__':
    for resource in resources:
        prompt_message = 'Would you like to delete all {}{}? (y/n): '.format(
            resource[0].split('/')[-1],
            ' with an ID greater than {}'.format(resource[1]) if len(resource) > 1 else ''
        )
        try:
            if prompt and (raw_input(prompt_message).lower() not in ['y', 'yes']):
                continue
            delete_resources(*resource)
        except Exception as e:
            print(e)
            print "Error encountered in route {}".format(resource[0])
