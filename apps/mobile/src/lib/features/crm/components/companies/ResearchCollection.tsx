// apps/mobile/src/app/(tabs)/crm/(features)/companies/components/ResearchCollection.tsx
import { IntroHeader } from '@ui/composites/intro-header/intro-header';
import { Section } from '@ui/layout';
import { Button, Card, EmptyLine, List } from '@ui/primitives';
import * as React from 'react';
import { Pressable, Text, View } from 'react-native';

export type ResearchArticle = {
  id: string;
  title: string;
  source?: string;
  at?: string; // ISO date
  url?: string;
};

export type ResearchData = {
  overview?: string;
  highlights?: string[];
  articles?: ResearchArticle[];
};

export type ResearchCollectionProps = {
  name?: string;
  data?: ResearchData;
  loading?: boolean;
  onScan?: () => void;
  onOpenArticle?: (a: ResearchArticle) => void;
};

function RowBullet({ text }: { text: string }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 10,
        paddingVertical: 6,
        paddingHorizontal: 12,
      }}
    >
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: '#9AA3B2',
          marginTop: 8,
        }}
      />
      <Text
        className="text-text dark:text-text-dark"
        style={{ fontSize: 14, lineHeight: 20 }}
      >
        {text}
      </Text>
    </View>
  );
}

export default function ResearchCollection({
  name = 'This company',
  data,
  loading,
  onScan,
  onOpenArticle,
}: ResearchCollectionProps) {
  const hasAny =
    !!data?.overview ||
    (data?.highlights && data.highlights.length > 0) ||
    (data?.articles && data.articles.length > 0);

  return (
    <View>
      {/* Simple header (no stacked layout, no extra props) */}
      <IntroHeader
        text="Curated research: company facts, signals, and sources."
        variant="secondary"
      />

      {/* Actions row lives on the screen, below the header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 10,
          paddingBottom: 6,
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          label="Scan"
          iconLeft="sparkles-outline"
          variant="outline"
          tint="primary"
          size="sm"
          onPress={onScan}
          accessibilityLabel="Scan for company research"
        />
      </View>

      {/* 1) Overview */}
      <Section title="Overview" flushTop>
        {data?.overview ? (
          <View style={{ padding: 12 }}>
            <Text
              className="text-text dark:text-text-dark"
              style={{ fontSize: 14, lineHeight: 20 }}
            >
              {data.overview}
            </Text>
          </View>
        ) : (
          <EmptyLine
            text={loading ? 'Loading…' : `No overview for ${name} yet`}
          />
        )}
      </Section>

      {/* 2) Highlights */}
      <Section title="Highlights">
        {data?.highlights?.length ? (
          <View>
            {data.highlights.map((h, i) => (
              <RowBullet key={i} text={h} />
            ))}
          </View>
        ) : (
          <EmptyLine text="Add a few bullet points you care about" />
        )}
      </Section>

      {/* 3) Sources */}
      <Section title="Sources & recent news">
        {data?.articles?.length ? (
          <List>
            {data.articles.map((a, i) => {
              const sub = [
                a.source,
                a.at ? new Date(a.at).toLocaleDateString() : null,
              ]
                .filter(Boolean)
                .join(' • ');
              const row = (
                <View style={{ paddingVertical: 12, paddingHorizontal: 14 }}>
                  <Text
                    className="text-text dark:text-text-dark"
                    style={{ fontSize: 15, fontWeight: '600' }}
                  >
                    {a.title}
                  </Text>
                  {sub ? (
                    <Text
                      className="text-text-dim dark:text-text-dimDark"
                      style={{ fontSize: 12, marginTop: 4 }}
                    >
                      {sub}
                    </Text>
                  ) : null}
                </View>
              );
              return (
                <List.Item key={a.id} first={i === 0}>
                  {a.url && onOpenArticle ? (
                    <Pressable onPress={() => onOpenArticle(a)}>
                      {row}
                    </Pressable>
                  ) : (
                    row
                  )}
                </List.Item>
              );
            })}
          </List>
        ) : (
          <EmptyLine text="No sources yet — run a scan" />
        )}
      </Section>

      {!hasAny && !loading ? (
        <View style={{ marginTop: 12 }}>
          <Card inset={false} bodyClassName="p-4">
            <Text className="text-[14px] text-text-dim dark:text-text-dimDark">
              Start by tapping <Text style={{ color: '#8B9DFF' }}>Scan</Text> to
              auto-gather public info.
            </Text>
          </Card>
        </View>
      ) : null}
    </View>
  );
}
