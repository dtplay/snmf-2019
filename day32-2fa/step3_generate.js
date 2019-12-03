const otplib = require('otplib');

const gSecret = 'JY2VKRZUGRBVGUCBKZKE6NKEKNGVMSCHKM2UGMSQIIZUIUKOGJGA';

const code = otplib.authenticator.generate(gSecret);

console.info('code = ', code);