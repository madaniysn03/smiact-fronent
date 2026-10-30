import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Box, GlobalStyles, SxProps, Theme } from '@mui/material';
// eslint-disable-next-line camelcase
import { DM_Sans, Manrope } from '@next/font/google';
import { useTranslation } from 'react-i18next';
import Routes from '@common/defs/routes';
import { setUserLanguage } from '@common/components/lib/utils/language';

const dmSans = DM_Sans({ weight: ['400', '500', '700'], subsets: ['latin'], display: 'swap' });
const manrope = Manrope({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
});

const HEADING_FONT = manrope.style.fontFamily;
const NAV_HEIGHT = 76;
// The theme's lg breakpoint (1600px) is too wide: the full nav fits from 1180px.
const NAV_DESKTOP = '@media (min-width:1180px)';

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#0c1211',
  surface: '#151d1b',
  ink: '#f3f6ee',
  muted: '#a4b5ad',
  line: '#304039',
  lime: '#d7fa76',
  white: '#f6f7f0',
  dark: '#0e1613',
  greenOnLight: '#497a50',
  mutedOnLight: '#52615a',
  future: '#f0c98c',
};

const LANGUAGES = ['fr', 'en', 'es'];
const ICONS = {
  platform: ['◎', '✳', '▦'],
  intelligence: ['◉', '✳', '↗', '◈', '▤', '☷'],
};

type PersonaKey = 'company' | 'creator';
type TitleText = { title: string; text: string };

const useLandingTranslation = () => {
  const { t } = useTranslation('landing');
  const list = <T,>(key: string) => t(key, { returnObjects: true }) as unknown as T;
  return { t, list };
};

// ─── Layout primitives ────────────────────────────────────────────────────────
const Wrap = ({ children, sx }: { children: React.ReactNode; sx?: SxProps<Theme> }) => (
  <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: '20px', sm: '30px' }, ...(sx as object) }}>
    {children}
  </Box>
);

const Section = ({
  id,
  light,
  children,
}: {
  id?: string;
  light?: boolean;
  children: React.ReactNode;
}) => (
  <Box
    component="section"
    id={id}
    sx={{
      py: { xs: '72px', md: '104px' },
      borderTop: '1px solid #26342d',
      scrollMarginTop: `${NAV_HEIGHT}px`,
      bgcolor: light ? C.white : 'transparent',
      color: light ? C.dark : 'inherit',
    }}
  >
    <Wrap>{children}</Wrap>
  </Box>
);

const Eyebrow = ({ children, light }: { children: React.ReactNode; light?: boolean }) => (
  <Box
    sx={{
      fontSize: 11,
      letterSpacing: '2px',
      textTransform: 'uppercase',
      fontWeight: 700,
      color: light ? '#4d7d51' : C.lime,
    }}
  >
    {children}
  </Box>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Box
    component="h2"
    sx={{
      fontFamily: HEADING_FONT,
      fontWeight: 800,
      letterSpacing: '-.055em',
      lineHeight: 1.09,
      fontSize: 'clamp(32px, 4.5vw, 65px)',
      mt: '14px',
      mb: '20px',
    }}
  >
    {children}
  </Box>
);

const Sub = ({ children, light }: { children: React.ReactNode; light?: boolean }) => (
  <Box
    component="p"
    sx={{ m: 0, fontSize: 17, maxWidth: 760, color: light ? C.mutedOnLight : C.muted }}
  >
    {children}
  </Box>
);

const Accent = ({ children }: { children: React.ReactNode }) => (
  <Box component="span" sx={{ color: C.lime }}>
    {children}
  </Box>
);

const Chip = ({ children }: { children: React.ReactNode }) => (
  <Box
    component="span"
    sx={{
      display: 'inline-block',
      bgcolor: '#293b30',
      border: '1px solid #4b6550',
      color: '#e0eddb',
      borderRadius: '50px',
      fontSize: 11,
      px: '9px',
      py: '5px',
      mx: '2px',
      my: '3px',
    }}
  >
    {children}
  </Box>
);

const CTA = ({
  href,
  outline,
  small,
  dark,
  onClick,
  children,
}: {
  href: string;
  outline?: boolean;
  small?: boolean;
  dark?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) => {
  const fill = dark ? '#122019' : C.lime;
  const text = dark ? '#fff' : '#0c1510';
  const outlineText = dark ? '#122019' : C.ink;
  const outlineBorder = dark ? '#122019' : '#607166';
  return (
    <Box
      component={href.startsWith('#') ? 'a' : Link}
      href={href}
      onClick={onClick}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid',
        borderColor: outline ? outlineBorder : fill,
        bgcolor: outline ? 'transparent' : fill,
        color: outline ? outlineText : text,
        px: small ? '15px' : '19px',
        py: small ? '10px' : '13px',
        borderRadius: '8px',
        fontWeight: 700,
        fontSize: 13,
        whiteSpace: 'nowrap',
        textDecoration: 'none',
        '&:hover': { filter: 'brightness(.93)' },
      }}
    >
      {children}
    </Box>
  );
};

const Card = ({
  light,
  icon,
  title,
  text,
  status,
  statusColor,
}: TitleText & {
  light?: boolean;
  icon?: string;
  status?: string;
  statusColor?: string;
}) => (
  <Box
    sx={{
      bgcolor: light ? '#fff' : C.surface,
      border: '1px solid',
      borderColor: light ? '#dce3d9' : C.line,
      borderRadius: '15px',
      p: '27px',
    }}
  >
    {icon && (
      <Box
        aria-hidden
        sx={{ fontSize: 24, mb: '17px', color: light ? C.greenOnLight : C.lime, lineHeight: 1.2 }}
      >
        {icon}
      </Box>
    )}
    <CardTitle>{title}</CardTitle>
    <Box
      component="p"
      sx={{
        fontSize: 14,
        mt: 0,
        mb: status ? '14px' : 0,
        color: light ? C.mutedOnLight : '#b6c5ba',
      }}
    >
      {text}
    </Box>
    {status && (
      <Box
        sx={{ fontSize: 10, letterSpacing: '.5px', textTransform: 'uppercase', color: statusColor }}
      >
        {status}
      </Box>
    )}
  </Box>
);

const CardTitle = ({ children, sx }: { children: React.ReactNode; sx?: SxProps<Theme> }) => (
  <Box
    component="h3"
    sx={{
      fontFamily: HEADING_FONT,
      fontWeight: 800,
      fontSize: 23,
      letterSpacing: '-.04em',
      lineHeight: 1.09,
      mt: 0,
      mb: '12px',
      ...(sx as object),
    }}
  >
    {children}
  </Box>
);

const threeColumns = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
  gap: '15px',
  mt: '35px',
};

const Switches = <T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) => (
  <Box
    role="group"
    aria-label={label}
    sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap', my: '27px' }}
  >
    {options.map((option) => {
      const active = option.value === value;
      return (
        <Box
          key={option.value}
          component="button"
          type="button"
          aria-pressed={active}
          onClick={() => onChange(option.value)}
          sx={{
            font: 'inherit',
            cursor: 'pointer',
            border: '1px solid',
            borderColor: active ? C.lime : '#445348',
            borderRadius: '30px',
            px: '18px',
            py: '11px',
            bgcolor: active ? C.lime : '#1b2822',
            color: active ? '#101711' : '#e6ede6',
            fontWeight: active ? 700 : 400,
          }}
        >
          {option.label}
        </Box>
      );
    })}
  </Box>
);

// ═══════════════════════════════════════════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════════════════════════════════════════
const Brand = ({ size = 24 }: { size?: number }) => (
  <Box
    component="span"
    sx={{ fontFamily: HEADING_FONT, fontWeight: 800, fontSize: size, letterSpacing: '-1.6px' }}
  >
    SMIACT
    <Box component="span" aria-hidden sx={{ color: C.lime }}>
      ●
    </Box>
  </Box>
);

const LanguageSwitch = () => {
  const router = useRouter();
  const { t } = useLandingTranslation();

  const changeLanguage = (lang: string) => {
    setUserLanguage(lang);
    router.push(router.pathname, router.pathname, { locale: lang });
  };

  return (
    <Box role="group" aria-label={t('nav.language')} sx={{ display: 'flex', gap: '2px' }}>
      {LANGUAGES.map((lang) => (
        <Box
          key={lang}
          component="button"
          type="button"
          lang={lang}
          aria-pressed={router.locale === lang}
          onClick={() => changeLanguage(lang)}
          sx={{
            font: 'inherit',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            textTransform: 'uppercase',
            bgcolor: 'transparent',
            px: '6px',
            py: '4px',
            color: router.locale === lang ? C.lime : C.muted,
            '&:hover': { color: C.lime },
          }}
        >
          {lang}
        </Box>
      ))}
    </Box>
  );
};

const Navbar = ({ onPersona }: { onPersona: (persona: PersonaKey) => void }) => {
  const { t } = useLandingTranslation();
  const [open, setOpen] = useState(false);

  const links = [
    { href: '#platform', label: t('nav.platform') },
    { href: '#companies', label: t('nav.audiences') },
    { href: '#workflow', label: t('nav.workflow') },
    { href: '#intelligence', label: t('nav.intelligence') },
    { href: '#foundation', label: t('nav.foundation') },
    { href: '#faq', label: t('nav.faq') },
  ];

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        bgcolor: '#0c1211ec',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${C.line}`,
      }}
    >
      <Wrap
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: NAV_HEIGHT,
          gap: '20px',
        }}
      >
        <Box
          component="a"
          href="#top"
          aria-label={t('nav.home')}
          sx={{ color: 'inherit', textDecoration: 'none' }}
        >
          <Brand />
        </Box>
        <Box
          component="nav"
          id="landing-nav"
          sx={{
            display: open ? 'flex' : 'none',
            position: 'absolute',
            top: NAV_HEIGHT - 1,
            left: 0,
            right: 0,
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '18px',
            bgcolor: '#101a15',
            px: '30px',
            py: '22px',
            fontSize: 13,
            color: '#c4d0c9',
            whiteSpace: 'nowrap',
            [NAV_DESKTOP]: {
              display: 'flex',
              position: 'static',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '20px',
              bgcolor: 'transparent',
              p: 0,
            },
          }}
        >
          {links.map((link) => (
            <Box
              key={link.href}
              component="a"
              href={link.href}
              onClick={() => {
                setOpen(false);
                if (link.href === '#companies') {
                  onPersona('company');
                }
              }}
              sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: C.lime } }}
            >
              {link.label}
            </Box>
          ))}
          <LanguageSwitch />
          <Box
            component={Link}
            href={Routes.Auth.Login}
            sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: C.lime } }}
          >
            {t('nav.login')}
          </Box>
          <CTA href={Routes.Auth.Register} small>
            {t('nav.explore')} ↗
          </CTA>
        </Box>
        <Box
          component="button"
          type="button"
          aria-label={t('nav.menu')}
          aria-expanded={open}
          aria-controls="landing-nav"
          onClick={() => setOpen((value) => !value)}
          sx={{
            display: 'block',
            [NAV_DESKTOP]: { display: 'none' },
            bgcolor: 'transparent',
            color: 'white',
            fontSize: 26,
            cursor: 'pointer',
          }}
        >
          ☰
        </Box>
      </Wrap>
    </Box>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// HERO
// ═══════════════════════════════════════════════════════════════════════════════
const HeroPanelCard = ({
  card,
  children,
}: {
  card: { cap: string; title: string; text: string };
  children: React.ReactNode;
}) => (
  <Box
    sx={{
      bgcolor: '#101a17',
      border: '1px solid #34453b',
      borderRadius: '12px',
      p: '19px',
      minHeight: 205,
    }}
  >
    <Box
      sx={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '1.3px', color: '#a8b8aa' }}
    >
      {card.cap}
    </Box>
    <Box
      component="strong"
      sx={{
        display: 'block',
        fontFamily: HEADING_FONT,
        fontSize: 21,
        lineHeight: 1.2,
        mt: '20px',
        mb: '7px',
      }}
    >
      {card.title}
    </Box>
    <Box component="p" sx={{ fontSize: 12, color: '#aebdb3', mt: 0 }}>
      {card.text}
    </Box>
    {children}
  </Box>
);

const HeroSection = ({ onPersona }: { onPersona: (persona: PersonaKey) => void }) => {
  const { t, list } = useLandingTranslation();
  const chips = list<string[]>('hero.create.chips');

  return (
    <Box
      component="section"
      sx={{
        pt: { xs: '70px', md: '100px' },
        pb: { xs: '70px', md: '80px' },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          right: -140,
          top: 50,
          width: 450,
          height: 450,
          bgcolor: '#9cc34819',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />
      <Wrap sx={{ position: 'relative' }}>
        <Eyebrow>{t('hero.eyebrow')}</Eyebrow>
        <Box
          component="h1"
          sx={{
            fontFamily: HEADING_FONT,
            fontWeight: 800,
            letterSpacing: '-.055em',
            lineHeight: 1.09,
            fontSize: 'clamp(42px, 7.4vw, 106px)',
            maxWidth: 1100,
            my: '24px',
          }}
        >
          {t('hero.titleLine1')}
          <br />
          {t('hero.titleLine2')}
          <Accent>{t('hero.titleAccent')}</Accent>
        </Box>
        <Box
          component="p"
          sx={{ m: 0, fontSize: 'clamp(17px, 1.9vw, 22px)', color: '#c6d3ca', maxWidth: 760 }}
        >
          {t('hero.lead')}
        </Box>
        <Box sx={{ display: 'flex', gap: '12px', flexWrap: 'wrap', mt: '30px' }}>
          <CTA href="#companies" onClick={() => onPersona('company')}>
            {t('hero.forCompanies')} ↗
          </CTA>
          <CTA href="#companies" outline onClick={() => onPersona('creator')}>
            {t('hero.forCreators')} ↗
          </CTA>
        </Box>
        <Box component="p" sx={{ fontSize: 12, color: C.muted, mt: '25px', mb: 0 }}>
          {t('hero.micro')}
        </Box>
        <Box
          sx={{
            mt: { xs: '38px', md: '64px' },
            background: 'linear-gradient(130deg, #23342b, #101a17)',
            border: '1px solid #3b4d3f',
            borderRadius: '20px',
            p: '22px',
            boxShadow: '0 24px 80px #0005',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#d5e0d6',
              fontSize: 12,
              mb: '20px',
            }}
          >
            <span>◉ {t('hero.panelLabel')}</span>
            <Box component="span" aria-hidden sx={{ color: '#9eb49c', letterSpacing: '4px' }}>
              ● ● ●
            </Box>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1.5fr 1fr' },
              gap: '12px',
            }}
          >
            <HeroPanelCard card={list('hero.listen')}>
              <Chip>{t('hero.listen.chip')}</Chip>
            </HeroPanelCard>
            <HeroPanelCard card={list('hero.create')}>
              {chips.map((chip) => (
                <Chip key={chip}>{chip}</Chip>
              ))}
            </HeroPanelCard>
            <HeroPanelCard card={list('hero.learn')}>
              <Box
                aria-hidden
                sx={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: 75, my: '15px' }}
              >
                {[35, 58, 48, 80, 68, 100].map((height) => (
                  <Box
                    key={height}
                    sx={{
                      flex: 1,
                      height: `${height}%`,
                      borderRadius: '3px 3px 0 0',
                      background: `linear-gradient(${C.lime}, #5c8c65)`,
                    }}
                  />
                ))}
              </Box>
              <Chip>{t('hero.learn.chip')}</Chip>
            </HeroPanelCard>
          </Box>
        </Box>
      </Wrap>
    </Box>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PLATFORM
// ═══════════════════════════════════════════════════════════════════════════════
const PlatformSection = () => {
  const { t, list } = useLandingTranslation();
  const cards = list<(TitleText & { status: string; planned?: boolean })[]>('platform.cards');

  return (
    <Section id="platform" light>
      <Eyebrow light>{t('platform.eyebrow')}</Eyebrow>
      <SectionTitle>{t('platform.title')}</SectionTitle>
      <Sub light>{t('platform.sub')}</Sub>
      <Box sx={threeColumns}>
        {cards.map((card, index) => (
          <Card
            key={card.title}
            light
            icon={ICONS.platform[index]}
            title={card.title}
            text={card.text}
            status={card.status}
            statusColor={card.planned ? '#9a6a1f' : C.greenOnLight}
          />
        ))}
      </Box>
    </Section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPANIES & CREATORS
// ═══════════════════════════════════════════════════════════════════════════════
const AudiencesSection = ({
  persona,
  onPersona,
}: {
  persona: PersonaKey;
  onPersona: (persona: PersonaKey) => void;
}) => {
  const { t, list } = useLandingTranslation();
  const items = list<string[]>(`audiences.${persona}.items`);
  const rows = list<{ label: string; value: string }[]>('audiences.workspace.rows');
  const registerRoute =
    persona === 'company' ? Routes.Auth.RegisterClient : Routes.Auth.RegisterCreator;

  return (
    <Section id="companies">
      <Eyebrow>{t('audiences.eyebrow')}</Eyebrow>
      <SectionTitle>{t('audiences.title')}</SectionTitle>
      <Sub>{t('audiences.sub')}</Sub>
      <Switches<PersonaKey>
        label={t('audiences.switchLabel')}
        value={persona}
        onChange={onPersona}
        options={[
          { value: 'company', label: t('audiences.company.tab') },
          { value: 'creator', label: t('audiences.creator.tab') },
        ]}
      />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: '40px',
          alignItems: 'center',
          bgcolor: '#17231d',
          border: '1px solid #34493b',
          p: { xs: '24px', sm: '40px' },
          borderRadius: '18px',
        }}
      >
        <div>
          <Eyebrow>{t(`audiences.${persona}.tag`)}</Eyebrow>
          <CardTitle sx={{ fontSize: 'clamp(28px, 3vw, 42px)', mt: '15px' }}>
            {t(`audiences.${persona}.title`)}
          </CardTitle>
          <Box component="p" sx={{ mt: 0 }}>
            {t(`audiences.${persona}.text`)}
          </Box>
          <Box component="ul" sx={{ pl: '20px', mb: '24px', listStyle: 'disc' }}>
            {items.map((item) => (
              <Box component="li" key={item} sx={{ my: '11px', color: '#c6d3c8' }}>
                {item}
              </Box>
            ))}
          </Box>
          <CTA href={registerRoute}>{t(`audiences.${persona}.cta`)} ↗</CTA>
        </div>
        <Box
          sx={{ bgcolor: '#0d1812', border: '1px solid #334b38', p: '25px', borderRadius: '13px' }}
        >
          <Eyebrow>{t('audiences.workspace.eyebrow')}</Eyebrow>
          {rows.map((row) => (
            <Box
              key={row.label}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '10px',
                py: '14px',
                borderBottom: '1px solid #34443a',
                fontSize: 14,
              }}
            >
              <span>{row.label}</span>
              <Box component="b" sx={{ color: C.lime }}>
                {row.value}
              </Box>
            </Box>
          ))}
          <Box component="p" sx={{ fontSize: 12, color: C.muted, mt: '25px', mb: 0 }}>
            {t('audiences.workspace.note')}
          </Box>
        </Box>
      </Box>
    </Section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// WORKFLOW
// ═══════════════════════════════════════════════════════════════════════════════
const WorkflowSection = () => {
  const { t, list } = useLandingTranslation();
  const steps = list<(TitleText & { vision?: boolean })[]>('workflow.steps');

  return (
    <Section id="workflow">
      <Eyebrow>{t('workflow.eyebrow')}</Eyebrow>
      <SectionTitle>
        {t('workflow.titleLine1')}
        <br />
        <Accent>{t('workflow.titleAccent')}</Accent>
      </SectionTitle>
      <Sub>{t('workflow.sub')}</Sub>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(7, 1fr)' },
          gap: '8px',
          mt: '38px',
        }}
      >
        {steps.map((step, index) => (
          <Box
            key={step.title}
            sx={{
              px: '12px',
              py: '17px',
              border: `1px ${step.vision ? 'dashed' : 'solid'} #465747`,
              borderRadius: '10px',
              bgcolor: '#17241d',
              minHeight: 155,
            }}
          >
            <Box
              component="b"
              sx={{
                display: 'block',
                color: step.vision ? C.future : C.lime,
                fontSize: 11,
                mb: '20px',
              }}
            >
              0{index + 1} / {step.vision ? t('workflow.vision') : t('workflow.current')}
            </Box>
            <Box component="strong" sx={{ display: 'block', fontSize: 14, lineHeight: 1.3 }}>
              {step.title}
            </Box>
            <Box component="p" sx={{ fontSize: 11, color: '#aebfb1', mt: '9px', mb: 0 }}>
              {step.text}
            </Box>
          </Box>
        ))}
      </Box>
    </Section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// INTELLIGENCE
// ═══════════════════════════════════════════════════════════════════════════════
const IntelligenceSection = () => {
  const { t, list } = useLandingTranslation();
  const cards = list<TitleText[]>('intelligence.cards');

  return (
    <Section id="intelligence" light>
      <Eyebrow light>{t('intelligence.eyebrow')}</Eyebrow>
      <SectionTitle>
        {t('intelligence.titleLine1')}
        <br />
        {t('intelligence.titleLine2')}
      </SectionTitle>
      <Sub light>{t('intelligence.sub')}</Sub>
      <Box sx={threeColumns}>
        {cards.map((card, index) => (
          <Card
            key={card.title}
            light
            icon={ICONS.intelligence[index]}
            title={card.title}
            text={card.text}
          />
        ))}
      </Box>
      <Box
        sx={{
          bgcolor: '#e9efe4',
          color: '#425448',
          borderLeft: '3px solid #5d8a57',
          px: '18px',
          py: '14px',
          fontSize: 12,
          mt: '24px',
        }}
      >
        {t('intelligence.notice')}
      </Box>
    </Section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// INTERACTIVE CONCEPT
// ═══════════════════════════════════════════════════════════════════════════════
type Topic = {
  key: string;
  name: string;
  narrative: string;
  audience: string;
  content: string;
  briefTitle: string;
  briefBody: string;
};

const demoBox = {
  bgcolor: '#111b17',
  border: '1px solid #3b5240',
  borderRadius: '16px',
  p: '27px',
};

const ConceptSection = () => {
  const { t, list } = useLandingTranslation();
  const topics = list<Topic[]>('concept.topics');
  const [topicKey, setTopicKey] = useState('tourism');
  const topic = topics.find((item) => item.key === topicKey) ?? topics[0];

  const signals = [
    { label: t('concept.topicRow'), value: topic.name },
    { label: t('concept.narrativeRow'), value: topic.narrative },
    { label: t('concept.audienceRow'), value: topic.audience },
    { label: t('concept.contentRow'), value: topic.content },
  ];

  return (
    <Section>
      <Eyebrow>{t('concept.eyebrow')}</Eyebrow>
      <SectionTitle>
        {t('concept.titleLine1')}
        <br />
        {t('concept.titleLine2')}
      </SectionTitle>
      <Sub>{t('concept.sub')}</Sub>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1.1fr' },
          gap: '24px',
          alignItems: 'start',
          mt: '40px',
        }}
      >
        <Box sx={demoBox}>
          <Box sx={{ fontSize: 12, color: '#a9b9aa' }}>{t('concept.topicLabel')}</Box>
          <Switches
            label={t('concept.topicLabel')}
            value={topicKey}
            onChange={setTopicKey}
            options={topics.map((item) => ({ value: item.key, label: item.name }))}
          />
          {signals.map((signal) => (
            <Box
              key={signal.label}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '16px',
                py: '13px',
                borderBottom: '1px solid #314237',
                fontSize: 13,
              }}
            >
              <span>{signal.label}</span>
              <Box component="span" sx={{ color: C.lime, textAlign: 'right' }}>
                {signal.value}
              </Box>
            </Box>
          ))}
        </Box>
        <Box sx={demoBox}>
          <Eyebrow>{t('concept.briefEyebrow')}</Eyebrow>
          <CardTitle sx={{ mt: '16px' }}>{topic.briefTitle}</CardTitle>
          <Box component="p" sx={{ color: '#b5c7b8', mt: 0 }}>
            {topic.briefBody}
          </Box>
          <Chip>{t('concept.chipReview')}</Chip>
          <Chip>{t('concept.chipHuman')}</Chip>
          <Box component="p" sx={{ fontSize: 12, color: C.muted, mt: '25px', mb: '12px' }}>
            {t('concept.micro')}
          </Box>
          <CTA href="#workflow" small>
            {t('concept.cta')} ↗
          </CTA>
        </Box>
      </Box>
    </Section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// FOUNDATION
// ═══════════════════════════════════════════════════════════════════════════════
const FoundationSection = () => {
  const { t, list } = useLandingTranslation();
  const cards = list<TitleText[]>('foundation.cards');

  return (
    <Section id="foundation">
      <Eyebrow>{t('foundation.eyebrow')}</Eyebrow>
      <SectionTitle>
        {t('foundation.titleLine1')}
        <br />
        <Accent>{t('foundation.titleAccent')}</Accent>
      </SectionTitle>
      <Sub>{t('foundation.sub')}</Sub>
      <Box sx={threeColumns}>
        {cards.map((card) => (
          <Card key={card.title} title={card.title} text={card.text} />
        ))}
      </Box>
    </Section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// FAQ
// ═══════════════════════════════════════════════════════════════════════════════
const FaqSection = () => {
  const { t, list } = useLandingTranslation();
  const items = list<{ q: string; a: string }[]>('faq.items');

  return (
    <Section id="faq">
      <Eyebrow>{t('faq.eyebrow')}</Eyebrow>
      <SectionTitle>{t('faq.title')}</SectionTitle>
      {items.map((item) => (
        <Box
          component="details"
          key={item.q}
          sx={{ borderBottom: '1px solid #35463a', py: '20px' }}
        >
          <Box component="summary" sx={{ cursor: 'pointer', fontSize: 18, fontWeight: 700 }}>
            {item.q}
          </Box>
          <Box component="p" sx={{ color: '#b8c9bc', mt: '15px', mb: 0 }}>
            {item.a}
          </Box>
        </Box>
      ))}
    </Section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CTA
// ═══════════════════════════════════════════════════════════════════════════════
const FinalCtaSection = () => {
  const { t } = useLandingTranslation();

  return (
    <Box
      component="section"
      sx={{ bgcolor: C.lime, color: '#102017', textAlign: 'center', py: '90px', px: '20px' }}
    >
      <Eyebrow>
        <Box component="span" sx={{ color: '#426340' }}>
          {t('cta.eyebrow')}
        </Box>
      </Eyebrow>
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        <SectionTitle>
          {t('cta.titleLine1')}
          <br />
          {t('cta.titleLine2')}
        </SectionTitle>
      </Box>
      <Box component="p" sx={{ maxWidth: 650, mx: 'auto', mt: 0, mb: '25px' }}>
        {t('cta.text')}
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          mt: '30px',
        }}
      >
        <CTA href={Routes.Auth.Register} dark>
          {t('cta.primary')} ↗
        </CTA>
        <CTA href="#platform" outline dark>
          {t('cta.secondary')}
        </CTA>
      </Box>
    </Box>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════════════════════
const FooterLink = ({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick?: () => void;
  children: React.ReactNode;
}) => (
  <Box
    component={href.startsWith('#') ? 'a' : Link}
    href={href}
    onClick={onClick}
    sx={{
      display: 'block',
      fontSize: 13,
      color: '#b1c1b5',
      my: '9px',
      textDecoration: 'none',
      '&:hover': { color: C.lime },
    }}
  >
    {children}
  </Box>
);

const FooterSection = ({ onPersona }: { onPersona: (persona: PersonaKey) => void }) => {
  const { t } = useLandingTranslation();

  return (
    <Box component="footer" sx={{ pt: '55px', pb: '30px' }}>
      <Wrap>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '2fr 1fr 1fr' },
            gap: '30px',
          }}
        >
          <div>
            <Brand />
            <Box
              component="p"
              sx={{ maxWidth: 310, color: '#b4c4b8', fontSize: 14, mt: '15px', mb: 0 }}
            >
              {t('footer.tagline')}
            </Box>
          </div>
          <div>
            <b>{t('footer.platform')}</b>
            <FooterLink href="#companies" onClick={() => onPersona('company')}>
              {t('footer.forCompanies')}
            </FooterLink>
            <FooterLink href="#companies" onClick={() => onPersona('creator')}>
              {t('footer.forCreators')}
            </FooterLink>
            <FooterLink href="#workflow">{t('footer.howItWorks')}</FooterLink>
            <FooterLink href="#intelligence">{t('footer.intelligence')}</FooterLink>
          </div>
          <div>
            <b>{t('footer.company')}</b>
            <FooterLink href="#foundation">{t('footer.foundation')}</FooterLink>
            <FooterLink href="#faq">{t('footer.faq')}</FooterLink>
            <FooterLink href={Routes.Auth.Login}>{t('footer.login')}</FooterLink>
          </div>
        </Box>
        <Box sx={{ borderTop: '1px solid #314138', pt: '20px', mt: '35px' }}>
          <Box component="small" sx={{ color: '#879b8c' }}>
            © {new Date().getFullYear()} SMIACT — {t('footer.rights')}
          </Box>
        </Box>
      </Wrap>
    </Box>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const LandingPage: NextPage = () => {
  const { t } = useLandingTranslation();
  const [persona, setPersona] = useState<PersonaKey>('company');

  return (
    <>
      <Head>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
        <meta name="theme-color" content={C.bg} />
      </Head>
      <GlobalStyles styles={{ html: { scrollBehavior: 'smooth' } }} />
      <Box
        sx={{
          bgcolor: C.bg,
          color: C.ink,
          minHeight: '100vh',
          fontFamily: dmSans.style.fontFamily,
          lineHeight: 1.55,
          '& a:focus-visible, & button:focus-visible, & summary:focus-visible': {
            outline: `2px solid ${C.lime}`,
            outlineOffset: '3px',
          },
        }}
      >
        <Navbar onPersona={setPersona} />
        <main id="top">
          <HeroSection onPersona={setPersona} />
          <PlatformSection />
          <AudiencesSection persona={persona} onPersona={setPersona} />
          <WorkflowSection />
          <IntelligenceSection />
          <ConceptSection />
          <FoundationSection />
          <FaqSection />
          <FinalCtaSection />
        </main>
        <FooterSection onPersona={setPersona} />
      </Box>
    </>
  );
};

export default LandingPage;
