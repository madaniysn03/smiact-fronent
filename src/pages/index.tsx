import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import LandingPage from '@modules/landing/components/LandingPage';

const IndexPage = () => <LandingPage />;

// Bypass the default app Layout (no white app Topbar on landing page)
IndexPage.getLayout = (page: React.ReactNode) => <>{page}</>;

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['landing'])),
  },
});

export default IndexPage;
