const express = require('express');
const AccessControl = require('accesscontrol');

const router = express.Router();

router.use(
	(req, resp, next) => {
		const ac = new AccessControl(req.jwt.grants);

		if (!ac.hasResource('profile'))
			return resp.status(401).json({ message: 'error' });
		next();
	}
)

router.get('/profile/self',
	(req, resp) => {
		// Assume that role and grants are part of JWT
		const ac = new AccessControl(req.jwt.grants);
		for (let role of req.jwt.roles) {
			const perms = ac.can(role).readOwn('profile');
			if (perms.granted) {
				// access
				const profile = // get data from db
				return resp.status(200).json(perms.filter(profile));
			}
		}
		resp.status(401).json({ message: 'error' })
	}
)

router.get('/profile/:id',
	(req, resp) => {
		const ac = new AccessControl(req.jwt.grants);
		const perms = ac.can(req.jwt.role).readAny('profile');
	}
)


