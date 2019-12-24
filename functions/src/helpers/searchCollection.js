const admin = require('firebase-admin');

const db = admin.firestore();

const searchCollection = (collection, payload, filter = []) => {
  let query = db.collection(collection);

  if (filter.length === 0) {
    return false;
  }
  filter.map(search => {
    if (search === 'id') {
      query = query
        .where(admin.firestore.FieldPath.documentId(), '==', payload.id);
    }
    query = query.where(search, '==', payload[search]);
    return true;
  })
  return query
    .get()
    .then(snapshot => {
      let exists = false;
      if (!snapshot.empty) {
        exists = true;
      }
      return exists;
    });
}

module.exports = searchCollection;
