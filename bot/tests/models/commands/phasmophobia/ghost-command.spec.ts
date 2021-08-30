import { MessageEmbed } from 'discord.js';

import { Evidences } from '@models/db-entities/evidences';
import { GhostTypes } from '@models/db-entities/ghost-types';
import { GhostCommand } from '@models/commands/phasmophobia/ghost-command';

jest.mock('@models/db-entities/evidences')

describe('GhostCommand', () => {
  let command: GhostCommand = new GhostCommand();

  test('it should be named "ghost" ',() =>{
    expect(command.name).toBe('ghost');
  })

  test('it should have one paremeter named "ghost" ',() =>{
    expect(command.parameters.length).toBe(1);
    expect(command.parameters[0]).toBe('ghost');
  })

  describe('getDescription', () => {
    test('it should enumerate all available ghosts', async () => {
      GhostTypes.all = jest.fn().mockReturnValue([{ name: 'ghost1' }]);

       let desciption = await command.getDescription();
       expect(desciption.prettyPrint()).toBe(
       `I will give you information about the ghost type *ghost_type* that could be useful during a phasmophobia ghost hunt.\nThis are the ghost types I know:\n\t ■ ghost1\n`);
    });
  })

  describe('exec', () => {
    test('it should tell you tu try again if it is called without args', async () => {
      let reply = await command.exec([]);
      expect(reply).toBe('No entendiste nada, tenés que decirme qué fantasma querés.');
    });

    test('it should tell you the ghost does not exist it it doesnt', async () => {
      GhostTypes.get = jest.fn().mockReturnValue(undefined);
      let reply = await command.exec(['ghost2']);
      expect(reply).toBe("La cagaste amig@, no hay ningún fantasma que se llame así");
    })

    test('it should give detail information of posibble ghost if more than two evidences are provided', async () => {
      GhostTypes.get = jest.fn().mockReturnValue({
        name: 'ghost1',
        strength: 'a strength',
        weakness: 'a weakness',
        details: 'a detail'
      });

      Evidences.givenBy = jest.fn().mockReturnValue([{ name: 'evidence1' }, { name: 'evidence2' }, { name: 'evidence3'} ]);

      let reply = await command.exec(['ghost1']) as MessageEmbed;
      expect(reply.title).toBe('GHOST1');
      expect(reply.fields[0].name).toBe('Evidence 0');
      expect(reply.fields[0].value).toBe('Evidence1');
      expect(reply.fields[1].name).toBe('Evidence 1');
      expect(reply.fields[1].value).toBe('Evidence2');
      expect(reply.fields[2].name).toBe('Evidence 2');
      expect(reply.fields[2].value).toBe('Evidence3');
      expect(reply.fields[3].name).toBe('Strength');
      expect(reply.fields[3].value).toBe('a strength');
      expect(reply.fields[4].name).toBe('Weakness');
      expect(reply.fields[4].value).toBe('a weakness');
      expect(reply.fields[5].name).toBe('Details');
      expect(reply.fields[5].value).toBe('a detail');

    })
  })
});