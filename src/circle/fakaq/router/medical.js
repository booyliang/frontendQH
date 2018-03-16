import Medical from '../views/medical'
import HospitalDetail from '../views/medical/hospital-detail'
import DoctorDetail from '../views/medical/doctor-detail'

export default [
	{ path: '/medical', component: Medical, meta: { keepAlive: true } },
	{ path: '/hospital/detail/:id', component: HospitalDetail },
	{ path: '/doctor/detail/:id', component: DoctorDetail }
]