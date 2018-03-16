import ExpertEdit from '../views/attestation/edit'  
import ExpertField from '../views/attestation/field'
import ExpertInspect from '../views/attestation/inspect'

export default [
	{
		path: '/expert/edit/:id', // 达人认证
		component: ExpertEdit
	},
	{
		path: '/expert/field', // 擅长领域
		component: ExpertField
	},
	{
		path: '/expert/inspect/:id', // 审核中
		component: ExpertInspect
	}
]