import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: '🔍 Research with Parallel Sub-Agents',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        <code>/research_codebase</code> spawns specialized agents to explore your code in parallel.
        Automated codebase analysis generates structured research documents with file references and architectural insights.
      </>
    ),
  },
  {
    title: '📋 Plan with Context',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        <code>/create_plan</code> designs implementation with concrete steps.
        Plans stored in <code>thoughts/shared/plans/</code> become executable roadmaps
        that guide both you and Claude through complex features.
      </>
    ),
  },
  {
    title: '⚡ Implement Plan-Aware',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        <code>/implement_plan</code> executes with full context of your research and design.
        Checkboxes track progress. <code>/commit</code> creates conventional commits.
        Ship features faster with memory-first development.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
