import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LotteryType } from '../types/lottery';

interface LotteryBallsProps {
  numbers: number[];
  powerNumber?: number;
  lotteryType: LotteryType;
  size?: 'small' | 'medium' | 'large';
  showLabels?: boolean;
}

const LotteryBalls: React.FC<LotteryBallsProps> = ({
  numbers,
  powerNumber,
  lotteryType,
  size = 'medium',
  showLabels = true,
}) => {
  const getBallSize = () => {
    switch (size) {
      case 'small':
        return { width: 30, height: 30, fontSize: 12 };
      case 'large':
        return { width: 50, height: 50, fontSize: 18 };
      default:
        return { width: 40, height: 40, fontSize: 14 };
    }
  };

  const ballSize = getBallSize();

  const getBallColor = (isMainNumber: boolean = true) => {
    if (lotteryType === 'power655') {
      return isMainNumber ? '#FF6B6B' : '#FFD93D';
    } else {
      return '#4ECDC4';
    }
  };

  const renderBall = (number: number, isMainNumber: boolean = true) => (
    <View
      key={`${isMainNumber ? 'main' : 'power'}-${number}`}
      style={[
        styles.ball,
        {
          width: ballSize.width,
          height: ballSize.height,
          backgroundColor: getBallColor(isMainNumber),
        },
      ]}
    >
      <Text
        style={[
          styles.ballText,
          {
            fontSize: ballSize.fontSize,
            color: isMainNumber || lotteryType === 'mega645' ? 'white' : '#333',
          },
        ]}
      >
        {number.toString().padStart(2, '0')}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {showLabels && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {lotteryType === 'power655' ? 'Số chính' : 'Số may mắn'}
          </Text>
        </View>
      )}
      
      <View style={styles.ballsContainer}>
        {/* Main Numbers */}
        <View style={styles.mainNumbers}>
          {numbers.map((number) => renderBall(number, true))}
        </View>

        {/* Power Number for Power 6/55 */}
        {lotteryType === 'power655' && powerNumber && (
          <>
            {showLabels && (
              <View style={styles.powerLabelContainer}>
                <Text style={styles.powerLabel}>Power</Text>
              </View>
            )}
            <View style={styles.powerNumberContainer}>
              {renderBall(powerNumber, false)}
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  labelContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  ballsContainer: {
    alignItems: 'center',
  },
  mainNumbers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  powerLabelContainer: {
    marginTop: 12,
    marginBottom: 8,
  },
  powerLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  powerNumberContainer: {
    alignItems: 'center',
  },
  ball: {
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 2,
  },
  ballText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LotteryBalls;
