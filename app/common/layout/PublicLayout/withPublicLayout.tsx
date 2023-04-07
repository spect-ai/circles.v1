/* eslint-disable @typescript-eslint/no-explicit-any */
import PublicLayout from "./PublicLayout";

function withPublicLayout(WrappedComponent: any) {
  const WithPublicLayout = (props: any) => <WrappedComponent {...props} />;

  WithPublicLayout.getLayout = (page: any) => (
    <PublicLayout>{page}</PublicLayout>
  );

  return WithPublicLayout;
}

export default withPublicLayout;
