import Loading from '@/app/loading'
import React, { Suspense } from 'react'
import ScholarshipDetails from '@/components/scholarships/scholarship_details'

const ScholarshipDetailsPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <ScholarshipDetails />
    </Suspense>
  )
}

export default ScholarshipDetailsPage