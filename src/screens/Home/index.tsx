import React from 'react';
import {useQuery} from '@tanstack/react-query';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {FlatList, ScrollView, StyleSheet} from 'react-native';
import {Colors, ListItem, Text, View} from 'react-native-ui-lib';

import {Project} from '../../interfaces/project';
import {NavigationProp, StackList} from '../../navigations/types';
import {fetcher} from '../../utils/fetcher';
import TouchableCard from '../../components/TouchableCard';
import {useAuth} from '../../contexts/auth';
import {formatDate} from '../../utils/date';
import {PurchaseOrder} from '../../interfaces/purchaseOrder';

import Guest from './components/Guest';

const Home = () => {
  const {userID} = useAuth();
  const navigation = useNavigation<NavigationProp>();

  const handleNavigate = (screen: keyof StackList, tabId: number) => {
    navigation.jumpTo(screen, {tabId});
  };

  const {data: projects} = useQuery({
    queryKey: ['projects', userID],
    queryFn: () => fetcher<Project[]>({url: '/protected/projects'}),
  });

  const {data: purchaseOrders} = useQuery({
    queryKey: ['po', userID],
    queryFn: () => fetcher<PurchaseOrder[]>({url: '/protected/po'}),
  });

  return (
    <ScrollView style={styles.container}>
      <View row marginV-16 gap-8 paddingH-16>
        <Text text40>{formatDate(new Date(), 'dddd')}</Text>
        <Text text40L>{formatDate(new Date(), 'DD MMMM YYYY')}</Text>
      </View>

      {/*  userID > 0 mean internal user otherwise guest */}
      {Number(userID) > 0 && (
        <>
          <View flexG>
            <Text text60M marginH-16 marginV-4>
              Perlu Tindakan
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableCard
                onPress={() => handleNavigate('NeedAction', 0)}
                style={styles.card}>
                <View padding-12>
                  <Text text60M>{'Budget'}</Text>
                  <Text grey30>{'Persetujuan yang diperlukan'}</Text>
                  <Text text30 $textPrimary>
                    {projects?.data?.length ?? undefined}
                  </Text>
                  <Icon
                    name={'wallet-outline'}
                    size={96}
                    color={Colors.grey60}
                    style={styles.bgIcon}
                  />
                </View>
              </TouchableCard>
              <TouchableCard
                onPress={() => handleNavigate('NeedAction', 1)}
                style={styles.card}>
                <View padding-12>
                  <Text text60M>{'Purchase Order'}</Text>
                  <Text grey30>{'Persetujuan yang diperlukan'}</Text>
                  <Text text30 $textPrimary>
                    {purchaseOrders?.data?.length ?? undefined}
                  </Text>
                  <Icon
                    name={'receipt-outline'}
                    size={96}
                    color={Colors.grey60}
                    style={styles.bgIcon}
                  />
                </View>
              </TouchableCard>
            </ScrollView>
          </View>

          <View>
            <Text text60M marginH-16 marginV-4>
              Daftar Persetujuan
            </Text>
            <FlatList
              scrollEnabled={false}
              data={projects?.data}
              keyExtractor={item => item.kode_prod}
              renderItem={({item}) => (
                <ListItem
                  paddingH-16
                  onPress={() =>
                    navigation.navigate('ProjectDetail', {
                      taskId: item.kode_prod,
                    })
                  }>
                  <ListItem.Part
                    middle
                    containerStyle={{
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderColor: Colors.grey50,
                    }}>
                    <View>
                      <Text numberOfLines={1}>{item.kode_prod}</Text>
                      <Text numberOfLines={1}>{item.nama_prod}</Text>
                    </View>
                  </ListItem.Part>
                </ListItem>
              )}
            />
            <FlatList
              scrollEnabled={false}
              data={purchaseOrders?.data}
              keyExtractor={item => item.PONumber2}
              renderItem={({item}) => (
                <ListItem
                  paddingH-16
                  onPress={() =>
                    navigation.navigate('PurchaseOrderDetail', {
                      taskId: item.PONumber2,
                    })
                  }>
                  <ListItem.Part
                    middle
                    containerStyle={{
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderColor: Colors.grey50,
                    }}>
                    <View>
                      <Text numberOfLines={1}>{item.PONumber}</Text>
                      <Text numberOfLines={1}>{item.VendorName}</Text>
                    </View>
                  </ListItem.Part>
                </ListItem>
              )}
            />
          </View>
        </>
      )}

      {Number(userID) < 0 && <Guest />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  card: {
    width: 240,
    height: 120,
  },
  bgIcon: {
    position: 'absolute',
    top: 8,
    right: 0,
    zIndex: -1,
  },
});
export default Home;
