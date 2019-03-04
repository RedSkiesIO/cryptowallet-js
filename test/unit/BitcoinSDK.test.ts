import 'jest';
import axios from 'axios';
import CryptoWallet from '../../src/SDKFactory';

jest.mock('axios');
const mockAxios: any = axios;
const btc: any = CryptoWallet.createSDK('Bitcoin');
const eth: any = CryptoWallet.createSDK('Ethereum');
const entropy = 'nut mixture license bean page mimic iron spice rail uncover then warfare';
const network = 'BITCOIN_TESTNET';

describe('bitcoinSDK (wallet)', () => {
  describe('generateSegWitAddress', () => {
    it('can generate a BTC testnet segwit address', () => {
      const wallet: any = btc.generateHDWallet(entropy, network);
      const keypair: any = btc.generateKeyPair(wallet, 0);
      const address = btc.generateSegWitAddress(keypair);
      expect(address).toBe('tb1qgmfs2qjff3726j9sy76hpa2mnlnsvv4nnd7zxt');
    });

    it('can detect if an invalid keypair is used', () => {
      const wallet: any = eth.generateHDWallet(entropy, 'ETHEREUM');
      const keypair: any = eth.generateKeyPair(wallet, 0);
      expect(() => btc.generateSegWitAddress(keypair)).toThrow('Invalid keypair type');
    });
  });
  describe('generateSegWitP2SH', () => {
    it('can generate a BTC testnet segwit address', () => {
      const wallet: any = btc.generateHDWallet(entropy, network);
      const keypair: any = btc.generateKeyPair(wallet, 0);
      const address = btc.generateSegWitP2SH(keypair);
      expect(address).toBe('2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf');
    });
    it('can detect if an invalid keypair is used', () => {
      const wallet: any = eth.generateHDWallet(entropy, 'ETHEREUM');
      const keypair: any = eth.generateKeyPair(wallet, 0);
      expect(() => btc.generateSegWitP2SH(keypair)).toThrow('Invalid keypair type');
    });
  });

  describe('generateSegWit3of4MultiSigAddress', () => {
    it('can generate a BTC segwit 3 of 4 multisig address', () => {
      const address = btc.generateSegWit3of4MultiSigAddress(
        '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
        '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
        '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
        '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
        'BITCOIN',
      );
      expect(address).toBe('bc1q75f6dv4q8ug7zhujrsp5t0hzf33lllnr3fe7e2pra3v24mzl8rrqtp3qul');
    });

    it('can detect if an invalid network is used', () => {
      expect(() => btc.generateSegWit3of4MultiSigAddress(
        '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
        '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
        '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
        '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
        'ETHEREUM',
      )).toThrow('Invalid network');
    });

    it('can detect if an invalid public key is used', () => {
      expect(() => btc.generateSegWit3of4MultiSigAddress(
        '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e0',
        '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
        '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
        '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
        'BITCOIN',
      )).toThrow('Invalid public key used');
    });
  });

  describe('generateP2SHMultiSig', () => {
    const keys = [
      '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
      '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
      '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
      '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
    ];

    it('can generate a BTC testnet P2SH multisig', () => {
      const address = btc.generateP2SHMultiSig(keys, 'BITCOIN');
      expect(address).toBe('3DAeAnDta65gFaTB3QLNb3HA5kC3qSmBcm');
    });

    it('can detect if an invalid network is used', () => {
      expect(() => btc.generateP2SHMultiSig(keys, 'ETHEREUM')).toThrow('Invalid network');
    });

    it('can detect if an invalid public key is used', () => {
      expect(() => btc.generateP2SHMultiSig(
        ['026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e0',
          '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
          '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
          '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9'],
        'BITCOIN',
      )).toThrow('Invalid public key used');
    });
  });

  describe('getUTXOs', () => {
    it('can retrieve the UTXOs of a btc testnet address', async () => {
      mockAxios.get.mockResolvedValue({
        data: [{
          address: '2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf',
          txid: '48d2bc7293fe1b1b3c74b1276861c3ab1a63a01fbf87789c192f3491422e9dbf',
          vout: 82,
          scriptPubKey: 'a91441d8fdc7c1218b669e29928a209cd2d4df70ca9687',
          amount: 0.17433129,
          satoshis: 17433129,
          height: 1448809,
          confirmations: 29673,
        }],
      });
      const utxos = await btc.getUTXOs(['2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf'], network);
      expect(utxos[0].value).toBe(17433129);
    });

    it('can retrieve the UTXOs of a btc testnet address', async () => {
      mockAxios.get.mockResolvedValue({
        data: [],
      });
      const utxos = await btc.getUTXOs(['2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf'], network);
      expect(utxos).toEqual([]);
    });

    it('can detect if an invalid network is used', () => {
      expect(() => btc.getUTXOs(['2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf'], 'ETHEREUM')).toThrow('Invalid network');
    });

    it('can detect if an invalid address is used', () => {
      expect(() => btc.getUTXOs(['2MyFPraHtEy2uKttPeku1wzokVeyJGTYvk'], network)).toThrow('Invalid address used');
    });
    it('can detect an API error', async () => {
      mockAxios.get.mockResolvedValue(() => { throw new Error('some error'); });
      const utxos = btc.getUTXOs(['2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf'], network)
        .catch((e: Error) => expect(e.message).toBe('Failed to fetch UTXOs'));
      return utxos;
    });
  });

  describe('createTxToMany', () => {
    const wallet: any = btc.generateHDWallet(entropy, network);
    const utxo = [{
      address: '2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf',
      txid: '48d2bc7293fe1b1b3c74b1276861c3ab1a63a01fbf87789c192f3491422e9dbf',
      vout: 82,
      scriptPubKey: 'a91441d8fdc7c1218b669e29928a209cd2d4df70ca9687',
      amount: 0.17433129,
      satoshis: 17433129,
      height: 1448809,
      confirmations: 29673,
      value: 17433129,
    }];
    const accounts = [{
      address: '2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf',
      index: 0,
      change: false,
    }];
    it('can create a raw tx with 2 recepients ', async () => {
      const tx = await btc.createTxToMany(
        accounts,
        ['2NCJs2EA4gwiGJQYpKXoPiebR2vQsBNzdaA'],
        utxo,
        wallet,
        ['2NB9kPS83wUZHdFu222vJNXSJXBvVoVgvqc',
          '2Mt7HbkByM5SRjVFBnxBAyBsUwJWWDQrQcH'],
        [0.05, 0.05],
        36,
      );
      expect(tx.transaction.hash).toBe('383828987896c74ac5a5b560327ee066da6b148dc60b380a3320fae984a061c2');
    });

    it('can create a raw tx with 2 recepients and 2 change addresses ', async () => {
      const changeAccount = [{
        address: '2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf',
        index: 0,
        change: true,
      }];
      const tx = await btc.createTxToMany(
        changeAccount,
        ['2NCJs2EA4gwiGJQYpKXoPiebR2vQsBNzdaA',
          '2NDbQDbR89XMTbTDSzfWUS93DXbywDqYCtH'],
        utxo,
        wallet,
        ['2NB9kPS83wUZHdFu222vJNXSJXBvVoVgvqc',
          '2Mt7HbkByM5SRjVFBnxBAyBsUwJWWDQrQcH'],
        [0.05, 0.05],
        36,
      );
      expect(tx.transaction.hash).toBe('b7985529236e5af800274c7af46ed4d4ed96b390d41ba314f178414c080eed8a');
    });

    it('can create a Dash testnet raw transaction with 2 recepients', async () => {
      const dashWallet: any = btc.generateHDWallet(entropy, 'DASH_TESTNET');
      const dashUtxo = [{
        address: 'yWxRFULbGzvNuFafp1jUFNenXbiGrdoNWr',
        txid: 'ca6f45c6105e924df1ec6cc48ae8634e8e802fd7a039584d0e6d252ee981e73d',
        vout: 0,
        scriptPubKey: 'a914d11a8d42832ff79dad1e76a91474af505593334219ac81a2fa6f165f02ce7049d588ac902f814a876d43eca05587',
        amount: 189.3686,
        satoshis: 189368600000,
        height: 47586,
        confirmations: 3,
        value: 189368600000,
      }];

      const dashAccounts = [{
        address: 'yWxRFULbGzvNuFafp1jUFNenXbiGrdoNWr',
        index: 0,
        change: false,
      }];

      const rawTx = await btc.createTxToMany(
        dashAccounts,
        ['yifJaS4dzhySqAWmFfm3E2gaysZRQmaJix'],
        dashUtxo,
        dashWallet,
        ['yc1v3o1TkA5TUKntjFriDcoRBKgJ4hutZM',
          'yLhoHGyVegBkDJWfzJZNuZtse1g7w2mxTU'],
        [5, 5],
        36,
      );
      expect(rawTx.transaction.hash).toBe('9557278adae402b63f0fb4a369f93db4e68b5be46c6fe6cb76968192d1afedc8');
    });

    it('can detect an invalid wallet object ', async () => {
      expect(() => btc.createTxToMany(
        accounts,
        ['2NCJs2EA4gwiGJQYpKXoPiebR2vQsBNzdaA'],
        utxo,
        'wallet',
        ['2NB9kPS83wUZHdFu222vJNXSJXBvVoVgvqc',
          '2Mt7HbkByM5SRjVFBnxBAyBsUwJWWDQrQcH'],
        [0.05, 0.05],
        36,
      )).toThrow('Invalid wallet type');
    });

    it('can detect when there is no balance when creating a transaction', async () => {
      const emptyUtxo:any = [];
      expect(btc.createTxToMany(
        accounts,
        ['2NCJs2EA4gwiGJQYpKXoPiebR2vQsBNzdaA'],
        emptyUtxo,
        wallet,
        ['2NB9kPS83wUZHdFu222vJNXSJXBvVoVgvqc',
          '2Mt7HbkByM5SRjVFBnxBAyBsUwJWWDQrQcH'],
        [0.1, 0.1],
        36,
      )).rejects.toEqual(new Error('You don\'t have enough balance to cover transaction'));
    });

    it('can detect when there is not enough balance to cover the transaction', async () => {
      expect(btc.createTxToMany(
        accounts,
        ['2NCJs2EA4gwiGJQYpKXoPiebR2vQsBNzdaA'],
        utxo,
        wallet,
        ['2NB9kPS83wUZHdFu222vJNXSJXBvVoVgvqc',
          '2Mt7HbkByM5SRjVFBnxBAyBsUwJWWDQrQcH'],
        [5, 5],
        36,
      )).rejects.toEqual(new Error('You don\'t have enough Satoshis to cover the miner fee.'));
    });
  });

  describe('generateSegWit3of4MultiSigAddress', () => {
    it('can generate a BTC segwit 3 of 4 multisig address', () => {
      const address = btc.generateSegWit3of4MultiSigAddress(
        '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
        '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
        '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
        '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
        'BITCOIN',
      );
      expect(address).toBe('bc1q75f6dv4q8ug7zhujrsp5t0hzf33lllnr3fe7e2pra3v24mzl8rrqtp3qul');
    });

    it('can detect if an invalid network is used', () => {
      expect(() => btc.generateSegWit3of4MultiSigAddress(
        '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
        '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
        '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
        '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
        'ETHEREUM',
      )).toThrow('Invalid network');
    });

    it('can detect if an invalid public key is used', () => {
      expect(() => btc.generateSegWit3of4MultiSigAddress(
        '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e0',
        '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
        '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
        '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
        'BITCOIN',
      )).toThrow('Invalid public key used');
    });
  });

  describe('generateP2SHMultiSig', () => {
    const keys = [
      '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
      '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
      '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
      '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
    ];

    it('can generate a BTC testnet P2SH multisig', () => {
      const address = btc.generateP2SHMultiSig(keys, 'BITCOIN');
      expect(address).toBe('3DAeAnDta65gFaTB3QLNb3HA5kC3qSmBcm');
    });

    it('can detect if an invalid network is used', () => {
      expect(() => btc.generateP2SHMultiSig(keys, 'ETHEREUM')).toThrow('Invalid network');
    });

    it('can detect if an invalid public key is used', () => {
      expect(() => btc.generateP2SHMultiSig(
        ['026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e0',
          '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
          '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
          '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9'],
        'BITCOIN',
      )).toThrow('Invalid public key used');
    });
  });

  describe('create1t1tx', () => {
    const utxo = [{
      address: '2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf',
      txid: '48d2bc7293fe1b1b3c74b1276861c3ab1a63a01fbf87789c192f3491422e9dbf',
      vout: 82,
      scriptPubKey: 'a91441d8fdc7c1218b669e29928a209cd2d4df70ca9687',
      amount: 0.17433129,
      satoshis: 17433129,
      height: 1448809,
      confirmations: 29673,
      value: 17433129,
    }];

    it('can create a 1 to 1 btc testnet transaction', () => {
      const wallet: any = btc.generateHDWallet(entropy, network);
      const keypair: any = btc.generateKeyPair(wallet, 0);
      const tx = btc.create1t1tx(
        keypair,
        utxo[0].txid,
        utxo[0].vout,
        utxo[0].value,
        'mfhV5QiSeuzzKasgTYPZWJqqQyJxENGSmK',
        17433000,
      );
      expect(tx).toBe(
        '01000000000101bf9d2e4291342f199c7887bf1fa0631aabc3616827b1743c1b1bfe9372bcd248520000001716001446d30502494c7cad48b027b570f55b9fe70632b3ffffffff01a8010a01000000001976a91401fddae9f9a820f0c6f28e2db916bdc0341f869788ac0248304502210085b36e03d8b2f8dae99b83dd5ca226b9122550900f9b0a7991efd8cca989a9eb022039bf3db65cfac51d3028912a5d443442b57295edb23fe0e590a7c7a9ec2de517012103f3ce9fafbcf2da98817a706e5d41272455df20b8f832f6700c1bb2652ac44de000000000',
      );
    });

    it('can create a 1 to 1 dash testnet transaction', () => {
      const wallet: any = btc.generateHDWallet(entropy, 'DASH_TESTNET');
      const keypair: any = btc.generateKeyPair(wallet, 0);
      const dashUtxo = [{
        address: 'yWxRFULbGzvNuFafp1jUFNenXbiGrdoNWr',
        txid: 'ca6f45c6105e924df1ec6cc48ae8634e8e802fd7a039584d0e6d252ee981e73d',
        vout: 0,
        scriptPubKey: 'a914d11a8d42832ff79dad1e76a91474af505593334219ac81a2fa6f165f02ce7049d588ac902f814a876d43eca05587',
        amount: 189.3686,
        satoshis: 189368600000,
        height: 47586,
        confirmations: 3,
        value: 189368600000,
      }];

      const tx = btc.create1t1tx(
        keypair,
        dashUtxo[0].txid,
        dashUtxo[0].vout,
        dashUtxo[0].value,
        'yc1v3o1TkA5TUKntjFriDcoRBKgJ4hutZM',
        189368500000,
      );
      expect(tx).toBe(
        '01000000013de781e92e256d0e4d5839a0d72f808e4e63e88ac46cecf14d925e10c6456fca000000006a47304402201d51ca0f2bf01e85fbde49a83e1692cdee189e4e128775e6160750775c3f51f1022052f1bafa0da086c38ab86b56205f0681b55e9d21e49423c6eca9338d9205d3bc012103545bb4c84f82bb1a8e4a270715aa60c58a5331777c6929acf587b3dcdcf36c58ffffffff0120ff3d172c0000001976a914ac313b030c9c66561acf9fb8146d60ab73ffe71288ac00000000',
      );
    });

    it('can detect an invalid keypair', () => {
      const wallet: any = btc.generateHDWallet(entropy, network);
      const keypair: any = btc.generateKeyPair(wallet, 0);
      expect(() => btc.create1t1tx(
        'keypair',
        utxo[0].txid,
        utxo[0].vout,
        utxo[0].value,
        'mfhV5QiSeuzzKasgTYPZWJqqQyJxENGSmK',
        17433000,
      )).toThrow('Invalid keypair');
    });
  });

  describe('create2t2tx', () => {
    const utxo1 = {
      address: '2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf',
      txid: '48d2bc7293fe1b1b3c74b1276861c3ab1a63a01fbf87789c192f3491422e9dbf',
      vout: 82,
      scriptPubKey: 'a91441d8fdc7c1218b669e29928a209cd2d4df70ca9687',
      amount: 0.17433129,
      satoshis: 17433129,
      height: 1448809,
      confirmations: 29673,
      value: 17433129,
    };

    const utxo2 = {
      address: '2N6JMWTb79SMh94j82jfMKDSL3wXWkb1MFM',
      txid: 'a4ce3ca2423dd17e9d464aac043cd3b081b1a565c03940d0743284404fb80578',
      vout: 0,
      scriptPubKey: 'a9148f312921f28e71e3c996db61f6582e13ae62675e87',
      amount: 0.001,
      satoshis: 100000,
      height: 1445718,
      confirmations: 36104,
    };

    it('can create a 2 to 2 btc testnet transaction', () => {
      const wallet: any = btc.generateHDWallet(entropy, network);
      const keypair1: any = btc.generateKeyPair(wallet, 0);
      const keypair2: any = btc.generateKeyPair(wallet, 1);
      const tx = btc.create2t2tx(
        keypair1,
        keypair2,
        utxo1,
        utxo2,
        { address: '2ND1J2aHuKaVeiT2b7yYR2xXv363r8fb7tt', amount: 50000 },
        { address: '2MzfXyakzRekKgRHwh7AfpkLUhiab9ALX2P', amount: 50000 },
      );
      expect(tx).toBe(
        '01000000000102bf9d2e4291342f199c7887bf1fa0631aabc3616827b1743c1b1bfe9372bcd248520000001716001446d30502494c7cad48b027b570f55b9fe70632b3ffffffff7805b84f40843274d04039c065a5b181b0d33c04ac4a469d7ed13d42a23ccea40000000017160014003bb69952a6357962f375078916826f885d4fbdffffffff0250c300000000000017a914d8c010704698d35bcbc863bd9b06d18577455bec8750c300000000000017a9145161e10e28aee91fdc30ad794abd8f071cdeefcf8702483045022100c49574263eb7a9b1eda9fac81b49003c81e6aec4c46d654241ef9076d11e714f02206ac7a062bf7b61a8e2cbce6176f65e2345f89206a5e5e5f7888dc09c74ac80c1012103f3ce9fafbcf2da98817a706e5d41272455df20b8f832f6700c1bb2652ac44de00247304402205a6e27d7be45b768a59ec112008d847126829a937d57e31e5724ef2ac9273bb802204feacfeaf1dc3436095f4dc9a33bd8e5f6deadc8ed00cad10d66e6f582efcd2b0121038b42204c5877c7e7a7a7b405bfdc562f7938f449dd369006100ac5e025cb3d5a00000000',
      );
    });

    it('can create a 2 to 2 dash testnet transaction', () => {
      const dashUtxo1 = {
        address: 'yWxRFULbGzvNuFafp1jUFNenXbiGrdoNWr',
        txid: 'ca6f45c6105e924df1ec6cc48ae8634e8e802fd7a039584d0e6d252ee981e73d',
        vout: 0,
        scriptPubKey: 'a914d11a8d42832ff79dad1e76a91474af505593334219ac81a2fa6f165f02ce7049d588ac902f814a876d43eca05587',
        amount: 189.3686,
        satoshis: 189368600000,
        height: 47586,
        confirmations: 3,
        value: 189368600000,
      };
      const dashUtxo2 = {
        address: 'yi1f7Y6Y9NKg2B3ertcdPgyn9QwxKj8vdc',
        txid: 'a74b40e1e927ca9e83d368dfbbda9646bc16c94d0105020e18c01212253b8a16',
        vout: 0,
        scriptPubKey: '76a914edf5848923a8bfce51aae9e73bf4199c7c6342b888ac',
        amount: 173.7014,
        satoshis: 17370140000,
        height: 50963,
        confirmations: 5,
        value: 173701400000,
      };
      const wallet: any = btc.generateHDWallet(entropy, 'DASH_TESTNET');
      const keypair1: any = btc.generateKeyPair(wallet, 0);
      const keypair2: any = btc.generateKeyPair(wallet, 1);
      const tx = btc.create2t2tx(
        keypair1,
        keypair2,
        dashUtxo1,
        dashUtxo2,
        { address: 'yc1v3o1TkA5TUKntjFriDcoRBKgJ4hutZM', amount: 10000000 },
        { address: 'yc1v3o1TkA5TUKntjFriDcoRBKgJ4hutZM', amount: 10000000 },
      );
      expect(tx).toBe(
        '01000000023de781e92e256d0e4d5839a0d72f808e4e63e88ac46cecf14d925e10c6456fca000000006a47304402207bc46d7c15d46dd73080ca5745cb16435f41e29046169dab0ac9020992b25fdb02204bb0d91a409306ec29f5105cf3363bf054fe5449f8c48adb72568e8a591be746012103545bb4c84f82bb1a8e4a270715aa60c58a5331777c6929acf587b3dcdcf36c58ffffffff168a3b251212c0180e0205014dc916bc4696dabbdf68d3839eca27e9e1404ba7000000006b4830450221009c36a344502c7d9ecbcfabe0fb58988a2355af094428ede754306b7929380e620220077f359b01b19a8447d775ad27d0d55c904d2add2d66be8a3273358802e226a4012102c2d32ae7e727f19265dcd73f5875a4728cb0cd01b0214a1d449971ae4764a518ffffffff0280969800000000001976a914ac313b030c9c66561acf9fb8146d60ab73ffe71288ac80969800000000001976a914ac313b030c9c66561acf9fb8146d60ab73ffe71288ac00000000',
      );
    });

    it('can detect an invalid keypair', () => {
      const wallet: any = btc.generateHDWallet(entropy, network);
      const keypair: any = btc.generateKeyPair(wallet, 0);
      expect(() => btc.create2t2tx(
        keypair,
        'keypair2',
        utxo1,
        utxo2,
        { address: '2ND1J2aHuKaVeiT2b7yYR2xXv363r8fb7tt', amount: 50000 },
        { address: '2MzfXyakzRekKgRHwh7AfpkLUhiab9ALX2P', amount: 50000 },
      )).toThrow('Invalid keypair');
    });
  });
});


