import { Skeleton } from '@edb/shared-ui-rn';
import { View } from 'react-native';

type Props = {
  /** 'circle' for contacts, 'rounded' (8px) for companies */
  avatarShape?: 'circle' | 'rounded';
  /** show a subtitle line under the title */
  hasSubtitle?: boolean;
  /** show a small tag pill under title/subtitle */
  /** show a big pill in the details strip */
  showDetailsPill?: boolean;
};

export function EntityItemSkeleton({
  avatarShape = 'circle',
  hasSubtitle = true,
  showDetailsPill = true,
}: Props) {
  const avatarRadius = avatarShape === 'circle' ? 24 : 8;

  return (
    <View
      style={{ paddingHorizontal: 14, paddingVertical: 14, borderRadius: 16 }}
    >
      {/* header row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Skeleton width={48} height={48} radius={avatarRadius} />

        <View style={{ flex: 1, minWidth: 0, marginTop: 4 }}>
          {/* title */}
          <Skeleton width="50%" height={18} radius={6} />

          {/* subtitle */}
          {hasSubtitle && (
            <View style={{ marginTop: 6 }}>
              <Skeleton width="75%" height={13} radius={6} />
            </View>
          )}
        </View>

        {/* trailing chevron spacer */}
        <View style={{ width: 18, height: 18 }} />
      </View>

      {/* details strip */}
      <View style={{ marginTop: 10 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {showDetailsPill ? (
            <Skeleton width={160} height={30} radius={24} />
          ) : (
            <Skeleton width={0} height={0} radius={0} />
          )}
        </View>
      </View>
    </View>
  );
}
