import React from 'react';
import { useDevice } from '../context/DeviceContext';
import {NavbarMobile} from './navbar/NavbarMobile';
import {NavbarTablet} from './navbar/NavbarTablet';
import {NavbarDesktop} from './navbar/NavbarDesktop';

const ResponsiveNavbar: React.FC = () => {
  const { width } = useDevice();

  if (width < 768) {
    return <NavbarMobile />;
  } else if (width >= 768 && width < 1024) {
    return <NavbarTablet />;
  } else {
    return <NavbarDesktop />;
  }
};

export default ResponsiveNavbar;
