import regester from './sw?sw'
;(async () => {
  const regestered = await regester({})
  await regestered.unregister()
  await regester({})
})()
