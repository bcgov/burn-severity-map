import requests

class WFS:
    wfs_url = 'https://openmaps.gov.bc.ca/geo/pub/ows?'

    @staticmethod
    def get_data(dataset: str, query: str=None, fields: list=None):
        pagesize = 10000
        r = WFS.wfs_query(dataset=dataset, query=query, fields=fields)
        matched = int(r.get('numberMatched'))
        returned = int(r.get('numberReturned'))
        features = (r.get('features'))
        while returned < matched:
            start_index = returned
            r = WFS.wfs_query(dataset=dataset, start_index=start_index, count=pagesize, query=query, fields=fields)
            returned += int(r.get('numberReturned'))
            features = features + r.get('features')
        return features

    @staticmethod
    def wfs_query( dataset: str, start_index: int=None, count: int=None, query: str=None, fields: list=None):
        params = {
                    'service': 'WFS',
                    'version': '2.0.0',
                    'request': 'GetFeature',
                    'typeName': f'pub:{dataset}',
                    'outputFormat': 'json'
                  }

        if query:
            params['CQL_FILTER'] = query
        if fields:
            params['propertyName']=','.join(fields)
        if start_index:
            params['startIndex'] = start_index
            params['sortBy'] = 'OBJECTID'
        if count:
            params['count'] = count
        r = requests.get(WFS.wfs_url, params)

        return r.json()