import Index from '../activity/index';
import Details from '../activity/details';
import Signup from '../activity/signup';
import Participants from '../activity/participants';
import New from '../activity/new';
import Address from '../activity/address';
import Rules from '../activity/rules';
import Sets from '../activity/set';

export default [
	{ path: "activity/index", component: Index },
	{ path: "activity/details/:activityId", component: Details },
	{ path: "activity/details/:activityId/signup", component: Signup },
	{ path: "activity/details/:activityId/participants", component: Participants },
	{ path: "activity/new", name: 'activityNew', component: New },
	{ path: "activity/new/address", component: Address },
	{ path: "activity/new/rules", component: Rules },
	{ path: "activity/new/set", component: Sets }
]