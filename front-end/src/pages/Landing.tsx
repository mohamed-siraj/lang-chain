import React from 'react'
import PortalLayout from '../layouts/PortalLayout'
import { LandingContainer } from '../containers/Auth/Landing'
import ContentLayout from '../layouts/ContentLayout'

const Landing = () => {
  return (
    <PortalLayout>
        <LandingContainer />
    </PortalLayout>
  )
}

export default Landing