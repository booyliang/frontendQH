import LawyerIndex from '../views/attestation/lawyer/index'
import LawyerEdit from '../views/attestation/lawyer/edit'
import LawyerName from '../views/attestation/lawyer/edit-name'
import LawyerPhone from '../views/attestation/lawyer/edit-phone'
import LawyerFocus from '../views/attestation/lawyer/edit-focus'
import LawyerOffice from '../views/attestation/lawyer/edit-office'
import LawyerIntro from '../views/attestation/lawyer/edit-intro'
import LawyerCase from '../views/attestation/lawyer/edit-case'
import LawyerCity from '../views/attestation/lawyer/edit-city'
import LawyerPreview from '../views/attestation/lawyer/preview'
import LawyerDetail from '../views/attestation/lawyer/detail'

import OfficeIndex from '../views/attestation/office/index'
import OfficeEdit from '../views/attestation/office/edit'
import OfficeName from '../views/attestation/office/edit-name'
import OfficeTelephone from '../views/attestation/office/edit-telephone'
import OfficePhone from '../views/attestation/office/edit-phone'
import OfficeIntro from '../views/attestation/office/edit-intro'
import OfficeCase from '../views/attestation/office/edit-case'
import OfficeUrl from '../views/attestation/office/edit-url'
import OfficeJoin from '../views/attestation/office/edit-join-us'
import OfficePreview from '../views/attestation/office/preview'
import OfficeDetail from '../views/attestation/office/detail'

export default [
	{
		path: '/lawyer/index', // 律师列表
		component: LawyerIndex
	},
	{
		path: '/lawyer/edit/:id', // 律师认证
		component: LawyerEdit
	},
	{
		path: '/lawyer/edit-name',	// 姓名
		name: 'LawyerName',
		component: LawyerName
	},
	{
		path: '/lawyer/edit-phone',	// 手机号
		name: 'LawyerPhone',
		component: LawyerPhone
	},
	{
		path: '/lawyer/edit-city',	// 案例展示
		name: 'LawyerCity',
		component: LawyerCity
	},
	{
		path: '/lawyer/edit-focus',	// 关注领域
		name: 'LawyerFocus',
		component: LawyerFocus
	},
	{
		path: '/lawyer/edit-office', // 职业律所
		name: 'LawyerOffice',
		component: LawyerOffice
	},
	{
		path: '/lawyer/edit-intro',	// 个人简介
		name: 'LawyerIntro',
		component: LawyerIntro
	},
	{
		path: '/lawyer/edit-case',	// 案例展示
		name: 'LawyerCase',
		component: LawyerCase
	},
	{
		path: '/lawyer/preview',	// 律师预览
		name: 'LawyerPreview',
		component: LawyerPreview
	},
	{
		path: '/lawyer/detail/:id',	// 律师详情
		name: 'LawyerDetail',
		component: LawyerDetail
	},
	{
		path: '/office/index', // 律所列表
		component: OfficeIndex
	},
	{
		path: '/office/edit/:id',	// 律所认证
		component: OfficeEdit
	},
	{
		path: '/office/edit-name',	// 律所名称
		name: 'OfficeName',
		component: OfficeName
	},
	{
		path: '/office/edit-telephone',	// 律所电话
		name: 'OfficeTelephone',
		component: OfficeTelephone
	},
	{
		path: '/office/edit-phone',	// 联系人手机号
		name: 'OfficePhone',
		component: OfficePhone
	},
	{
		path: '/office/edit-intro',	// 简介
		name: 'OfficeIntro',
		component: OfficeIntro
	},
	{
		path: '/office/edit-case',	// 案例展示
		name: 'OfficeCase',
		component: OfficeCase
	},
	{
		path: '/office/edit-url',	//  网址
		name: 'OfficeUrl',
		component: OfficeUrl
	},
	{
		path: '/office/edit-join-us',	//  招聘信息
		name: 'OfficeJoin',
		component: OfficeJoin
	},
	{
		path: '/office/preview',	// 律所预览
		name: 'OfficePreview',
		component: OfficePreview
	},
	{
		path: '/office/detail/:id',	// 律所详情
		name: 'OfficeDetail',
		component: OfficeDetail
	},
]