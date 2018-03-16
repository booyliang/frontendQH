import ShootEdit from '../views/attestation/edit-basic'
import ShootEditPer from '../views/attestation/edit-perfect'
import ShootAd from '../views/attestation/ad'
import ShootAudit from '../views/attestation/audit'
import ShootApprove from '../views/attestation/approve'
import ShootDefeated from '../views/attestation/defeated'
import ShootPermit from '../views/attestation/permit'
import ShootHandCard from '../views/attestation/hand-card'
import ShootIdCard from '../views/attestation/id-card'
import ShootJump from '../views/attestation/jump'

export default [
	{
		path: '/shoot/basic/:id', // 认证
		component: ShootEdit
	},
	{
		path: '/shoot/perfect/:id',	// 完善认证
		name: 'ShootEditPer',
		component: ShootEditPer
	},
	{
		path: '/shoot/jump/:id',	// 认证中转
		name: 'ShootJump',
		component: ShootJump
	},
	{
		path: '/shoot/ad/:id',	// 广告
		name: 'ShootAd',
		component: ShootAd
	},
	{
		path: '/shoot/audit',	// 审核中
		name: 'ShootAudit',
		component: ShootAudit
	},
	{
		path: '/shoot/approve/:id',	// 审核通过
		name: 'ShootApprove',
		component: ShootApprove
	},
	{
		path: '/shoot/defeated',	// 审核不通过
		name: 'ShootDefeated',
		component: ShootDefeated
	},
	{
		path: '/shoot/permit/:id',	// 上传职位材料
		name: 'ShootPermit',
		component: ShootPermit
	},
	{
		path: '/shoot/hand-card/:id',	// 上传手持身份证
		name: 'ShootHandCard',
		component: ShootHandCard
	},
	{
		path: '/shoot/id-card/:id',	// 上传身份证正面
		name: 'ShootIdCard',
		component: ShootIdCard
	}
]