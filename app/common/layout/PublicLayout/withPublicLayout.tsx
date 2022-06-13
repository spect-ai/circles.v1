import React from 'react';

import PublicLayout from './PublicLayout';

function withPublicLayout(WrappedComponent: any) {
  function WithPublicLayout(props: any) {
    return <WrappedComponent {...props} />;
  }

  WithPublicLayout.getLayout = (page: any) => {
    return <PublicLayout>{page}</PublicLayout>;
  };

  return WithPublicLayout;
}

export default withPublicLayout;
