const db = require('../models')

// creates Congress member if they do not exist in collection and populates their transaction array
const populateCongress = async () => {
  const txns = await db.Transaction.find()
  members = []
  for (let i = 0; i < txns.length; i++) {
    if (!members.includes(txns[i].representative)) {
      members.push(txns[i].representative)
      const newCongressMember = {
        name: txns[i].representative,
        house: txns[i].house,
      }
      await db.CongressMember.create(newCongressMember)
    }
    const matchedCongressMember = await db.CongressMember.findOne({
      name: txns[i].representative,
    })
    matchedCongressMember.transactions.push(txns[i]._id)
    matchedCongressMember.save()
    console.log(`${i}`)
  }
}

const sortCongressMembers = async () => {
  const congress = await db.CongressMember.find()
  members = []
  for (let i = 0; i < congress.length; i++) {
    if (congress[i].transactions.length) {
      const foundMember = congress[i]
      foundMember.count = congress[i].transactions.length
      foundMember.save()
    }
  }

  return members
}

sortCongressMembers()
console.log('all done')
