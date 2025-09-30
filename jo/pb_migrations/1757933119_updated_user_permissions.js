/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("adadquft6s38bg8")

  collection.viewRule = "@request.auth.id != \"\" "

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("adadquft6s38bg8")

  collection.viewRule = "@request.auth.id != \"\" && @request.auth.permissions_id.read_permissions = true"

  return dao.saveCollection(collection)
})
