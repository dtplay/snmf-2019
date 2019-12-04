const AccessControl = require('accesscontrol');

const fred = {
	user_id: 'fredf',
	name: 'fred',
	email: 'fred@gmail.com',
	address: 'somewhere'
}

const grant = [
	{ role: 'user', resource: 'profile', action: 'update:own', attributes: [ '*', '!user_id' ] },
	{ role: 'user', resource: 'profile', action: 'read:own', },
	{ role: 'user', resource: 'profile', action: 'read:any', attributes: [ 'name' ] },
]

const ac = new AccessControl(grant);

console.info('admin role? ', ac.hasRole('admin'))
console.info('user role? ', ac.hasRole('user'))

console.info('has resource: ', ac.hasResource('profile'));
console.info('has accounts: ', ac.hasResource('accounts'));

let perms = ac.can('user').updateAny('profile');
console.info('update any profile: ', perms.granted);
console.info('filter any profile: ', perms.filter(fred));

perms = ac.can('user').updateOwn('profile');
console.info('filter any profile: ', perms.filter(fred));

perms = ac.can('user').readAny('profile');
console.info('filter read any profile: ', perms.filter(fred));
