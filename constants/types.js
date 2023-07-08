const MSG_TYPES = Object.freeze({
	ACCOUNT_CREATED: 'Account Successfully Created.',
	LOGGED_IN: 'Successfully logged in',
	DELETED: 'Resource Deleted Successfully',
	UPDATED: 'Resource Updated Successfully',
	CREATED: 'Resource Created Successfully',
	FETCHED: 'Resource Fetched Successfully',
	ACCOUNT_VERIFIED: 'Account Successfully Verified',
	AWAIT_ADMIN:
		'Account successfully verified. Awaiting administrator verification.',
	ACCOUNT_EXISTS: 'Account already exists for this mail.',
	ACCOUNT_INVALID: 'Invalid email or password',
	SUSPENDED: 'Account is suspended!',
	INACTIVE: 'Account is inactive!',
	DISABLED: 'Account is disabled!',
	NOT_FOUND: 'Not Found',
	RESET_MAIL_SENT: 'Reset Mail Sent',
	PASSWORD_RESET: 'Password Successfully Reset',
	UPLOAD_IMAGE: 'Image upload is required.',
	ACCESS_DENIED: 'Access denied.',
	SESSION_EXPIRED: 'Access denied. Your session has expired',
	DEACTIVATED: "Your account isn't activate",
	PERMISSION: "You don't have permission to perform this action",
	SERVER_ERROR: 'Server Error!',
	FREEMIUM: 'No pricing found.',
	FAILED_SUPPORT:
		"We currently don't have support for this location. Please contact our support for assistance",
	ACCOUNT_DELETED: 'Account no longer exists!',
	INVALID_PASSWORD: 'Invalid Password',
	RIDER_ASSIGN: 'Order sent to riders.',
	PROCEED_TO_PICKUP: 'Proceeding to pickup location',
	PICKED_UP: 'Item successfully picked up.',
	ARRIVED_AT_PICKUP: 'Arrival at pickup location confirmed',
	ARRIVED_AT_DELIVERY: 'Arrival at delivery location confirmed',
	PROCEED_TO_DELIVERY: 'Proceeding to delivery location',
	APPROVED: 'Resource approved successfully',
	CODE_EXPIRED: 'Code has expired',
	INVALID_TOKEN: 'Invalid token.',
	WRONG_TOKEN: 'Wrong user token. Access denied'
});


const USER_ROLES = Object.freeze({
	SUPER_ADMIN: 'superadmin',
	ADMIN: 'admin',
	CUSTOMER: 'customer',
	DRIVER: 'driver',
});

module.exports = {
	MSG_TYPES,
	USER_ROLES
};
