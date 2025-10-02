import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle" style={{fontSize: '1.5rem', marginBottom: '1rem'}}>
          Memory-First Development for Claude Code
        </p>
        <p style={{fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto 2rem', opacity: 0.9}}>
          Research. Plan. Implement. Commit.<br/>
          Build features faster with parallel sub-agents and persistent memory.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs">
            Get Started →
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="https://github.com/killerapp/mem8"
            style={{marginLeft: '1rem'}}>
            View on GitHub
          </Link>
        </div>
        <div style={{marginTop: '2rem', fontSize: '0.9rem', opacity: 0.8}}>
          <code>uv tool install mem8</code>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
