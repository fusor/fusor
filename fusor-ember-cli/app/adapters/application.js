import DS from 'ember-data';

export default DS.ActiveModelAdapter.extend({
    namespace: 'api/v3',
    host: 'http://localhost:3000',
    headers: {
       'Accept': 'application/json',
//       'AuthToken': '530448380e235e2925ef86eda2118638c52c8bc02404e403763a531f1f9d9c6f'
       'Authorization': 'Bearer 530448380e235e2925ef86eda2118638c52c8bc02404e403763a531f1f9d9c6f'
//     Authorization: "Basic " + Crypto.util.bytesToBase64(Crypto.charenc.Binary.stringToBytes('admin' + ":" + 'changeme'))
    },
});
