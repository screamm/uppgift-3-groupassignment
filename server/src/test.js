import Subscription from './src/models/Subscription';
const test = async () => {
    const subscription = await Subscription.findOne({ stripeId: 'sub_1PQq09KydTc2J8RVwDInTrCq' });
    console.log(subscription)
//     if (subscription) {
//         subscription.status = 'active';
//         subscription.nextBillingDate = new Date(invoice.lines.data[0].period.end * 1000);
//         await subscription.save();
//         console.log('Subscription set to active due to successful payment:', subscription);
//         res.json({ received: true });
// }
} 

test();

module.exports = {test};