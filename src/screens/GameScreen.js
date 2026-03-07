/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import {
  AppOpenAd,
  BannerAd,
  BannerAdSize,
  RewardedAd,
  RewardedAdEventType,
  RewardedInterstitialAd,
  TestIds,
} from 'react-native-google-mobile-ads';
import {arr, generateLevelData} from '../helper';

import {SvgXml} from 'react-native-svg';
import {allIcon} from '../utils/svgObjects';
import AnimatedContainer from '../components/AnimatedContainer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlowingBackground from '../components/GlowingBackground';
import SuccessParticles from '../components/SuccessParticles';

const WaterSortGame = () => {
  const availableColors = ['red', '#e6ccff', '#ff99cc', 'pink', 'aqua'];
  const initialData = [
    {isCompleted: false, color: ['red', 'red', 'red', 'aqua']},
    {isCompleted: false, color: ['#e6ccff', '#ff99cc', 'pink', 'aqua']},
    {isCompleted: false, color: ['red', 'aqua', 'aqua', 'pink']},
    {isCompleted: false, color: ['#e6ccff', '#e6ccff', '#e6ccff', 'pink']},
    {isCompleted: false, color: ['pink', '#ff99cc', '#ff99cc', '#ff99cc']},
    {isCompleted: false, color: []},
    {isCompleted: false, color: []},
  ];

  const [containers, setContainers] = useState({
    level: 1,
    levelData: [...initialData],
    isCompleted: false,
  });

  const [levelCompleted, setLevelCompleted] = useState(false);
  const [originalData] = useState(
    JSON.parse(JSON.stringify(containers?.levelData)),
  );
  // History stack for Undo functionality
  const [history, setHistory] = useState([
    JSON.parse(JSON.stringify(containers)),
  ]);

  useEffect(() => {
    AsyncStorage.getItem('levelData')
      .then(resp => {
        if (resp) {
          setContainers(JSON.parse(resp));
        } else {
          console.log('error in getting data');
        }
      })
      .catch(error => console.log(error));
    AsyncStorage.getItem('coins')
      .then(resp => setCoins(Number(resp)))
      .catch(error => console.log(error));
  }, []);

  const saveToHistory = () => {
    setHistory(prev => [...prev, JSON.parse(JSON.stringify(containers))]);
  };

  function handleNextLevel() {
    // Logic to reset or move to the next level can go here
    AsyncStorage.removeItem('levelData');
    const nextLevelData = generateLevelData(
      containers.level + 1,
      availableColors,
    );
    setContainers({
      level: containers.level + 1,
      levelData: nextLevelData,
    });
    setLevelCompleted(false);
    setHistory([JSON.parse(JSON.stringify(containers))]);
    AsyncStorage.setItem(
      'levelData',
      JSON.stringify({
        level: containers.level + 1,
        levelData: nextLevelData,
      }),
    );
  }

  function resetLevel() {
    showRewardAds();
    setContainers(pre => ({
      ...pre,
      levelData: JSON.parse(JSON.stringify(originalData)),
    }));
    setLevelCompleted(false);
    setHistory([JSON.parse(JSON.stringify(containers))]);
  }

  function undoLastMove() {
    if (history.length > 1) {
      const previousState = history[history.length - 1]; // Get the second-to-last state
      setHistory(prev => prev.slice(0, prev.length - 1)); // Remove the last state from history
      console.log('previousState', previousState);
      setContainers(JSON.parse(JSON.stringify(previousState))); // Revert to the previous state
    } else {
      setHistory([JSON.parse(JSON.stringify(containers))]);
    }
    showInterAds();
  }

  const MAX_EXTRA_TUBES = 1;

  function addTube() {
    const currentData = containers.levelData;
    // Count how many empty tubes already exist beyond the original empty ones
    const emptyTubes = currentData.filter(t => t.color.length === 0).length;
    if (emptyTubes >= MAX_EXTRA_TUBES + 2) {
      return; // Already at max allowed extra tubes
    }
    saveToHistory();
    const newTube = {isCompleted: false, color: []};
    setContainers(prev => ({
      ...prev,
      levelData: [...prev.levelData, newTube],
    }));
  }

  function menuFuncChange(data) {
    switch (data) {
      case 0:
        addTube();
        break;
      case 1:
        resetLevel();
        break;
      case 2:
        undoLastMove();
        break;
      default:
        null;
        break;
    }
  }

  const interstitialId = __DEV__
    ? TestIds.REWARDED_INTERSTITIAL
    : 'ca-app-pub-8456758478190776/4832484537';
  const rewardedID = __DEV__
    ? 'ca-app-pub-8456758478190776/2839766073'
    : 'ca-app-pub-8456758478190776/2839766073';

  const rewarded = RewardedAd.createForAdRequest(rewardedID, {
    keywords: arr,
  });

  const rewardedInterstitial = RewardedInterstitialAd.createForAdRequest(
    interstitialId,
    {
      keywords: arr,
    },
  );

  const [loaded, setLoaded] = useState(false);
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoaded(true);
        console.log('reward ad loaded');
      },
    );
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('User earned reward of ', reward);
        setCoins(pre => pre + 10);
        setLoaded(false);
      },
    );

    // Start loading the rewarded ad straight away
    rewarded.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, [loaded]);

  useEffect(() => {
    const unsubscribeLoaded = rewardedInterstitial.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoaded(true);
        console.log('ads loaded rewardedInterstitial');
      },
    );
    const unsubscribeEarned = rewardedInterstitial.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        setCoins(pre => pre + 5);
        console.log('User earned reward of ', reward);
        setLoaded(false);
      },
    );

    // Start loading the rewarded interstitial ad straight away
    rewardedInterstitial.load();
    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, [loaded]);

  useEffect(() => {
    if (coins === 0) {
      return;
    }
    AsyncStorage.setItem('coins', coins.toString());
  }, [coins]);

  function showInterAds() {
    if (loaded) {
      try {
        rewardedInterstitial.show();
      } catch (error) {
        console.error('Error showing ad: ', error);
        rewardedInterstitial.load(); // Reload the ad on failure
      }
    } else {
      console.log('Ad not loaded. Reloading now...');
      rewardedInterstitial.load(); // Ensure ad is ready for next click
    }
  }

  function showRewardAds() {
    if (loaded) {
      try {
        rewarded.show();
      } catch (error) {
        console.error('Error showing ad: ', error);
        rewarded.load(); // Reload the ad on failure
      }
    } else {
      console.log('Ad not loaded. Reloading now...');
      rewarded.load(); // Ensure ad is ready for next click
    }
  }

  return (
    <>
      <View style={{zIndex: 100, position: 'absolute', right: 25, top: 10}}>
        <Text
          style={{
            color: '#fff',
            fontSize: 20,
            fontWeight: '900',
            textAlign: 'center',
          }}>
          {coins ?? '0'}
        </Text>
      </View>
      <View
        style={{
          position: 'absolute',
          top: 0,
          zIndex: 99,
          flex: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 15,
        }}>
        {allIcon?.map((icon, iconIndex) => {
          return (
            <TouchableOpacity
              onPress={() => menuFuncChange(iconIndex)}
              style={{
                backgroundColor: '#000',
                width: 64,
                height: 64,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 32,
              }}
              key={iconIndex}>
              <SvgXml xml={icon} width={32} height={32} />
            </TouchableOpacity>
          );
        })}
      </View>
      <GlowingBackground>
        {levelCompleted ? (
          <View
            style={{
              width: '100%',
              justifyContent: 'space-around',
              alignItems: 'center',
              height: '80%',
            }}>
            {/* Victory confetti particles */}
            <SuccessParticles
              color="#FFD700"
              position={{left: 50, top: 300}}
            />
            <SuccessParticles
              color="#FF69B4"
              position={{left: 150, top: 300}}
            />
            <SuccessParticles
              color="#00D4FF"
              position={{left: 250, top: 300}}
            />
            
            <View style={styles.winTitle}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 36,
                  fontWeight: '900',
                  textAlign: 'center',
                  textShadowColor: '#f5073f',
                  textShadowOffset: {width: 0, height: 0},
                  textShadowRadius: 20,
                }}>
                AWESOME!
              </Text>
            </View>
            
            <TouchableOpacity style={styles.btn} onPress={handleNextLevel}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 26,
                  fontWeight: '600',
                  textAlign: 'center',
                }}>
                Next Level
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{width: '100%', alignItems: 'center'}}>
            <View style={styles.levelContainer}>
              <Text style={styles.levelText}>
                Level {containers?.level}
              </Text>
            </View>

            <AnimatedContainer
              setLevelCompleted={setLevelCompleted}
              containers={containers}
              setContainers={setContainers}
              saveToHistory={saveToHistory}
              onAddTube={addTube}
            />
          </View>
        )}
      </GlowingBackground>
    </>
  );
};

const styles = StyleSheet.create({
  gameBoard: {
    flex: 1,
    alignItems: 'center',
    paddingTop: '30%',
  },
  levelContainer: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    backgroundColor: 'rgba(10, 14, 39, 0.6)',
    borderWidth: 2,
    borderColor: '#00d4ff',
    shadowColor: '#00d4ff',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 10,
    marginTop: 90,
  },
  levelText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: '#00d4ff',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 15,
  },
  winTitle: {
    backgroundColor: '#f5073f',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    height: 70,
    shadowColor: '#f5073f',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  btn: {
    width: 200,
    height: 70,
    backgroundColor: '#f5073f',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    shadowColor: '#f5073f',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.9,
    shadowRadius: 25,
    elevation: 15,
    borderWidth: 2,
    borderColor: '#ff4466',
  },
});

export default WaterSortGame;
