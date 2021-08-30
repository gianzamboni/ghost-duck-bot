import { CluesCommand } from '@models/commands/phasmophobia/clues-command';
import { Evidences } from '@models/db-entities/evidences';
import { GhostTypes } from '@models/db-entities/ghost-types';
import { MessageEmbed } from 'discord.js';

jest.mock('@models/db-entities/evidences')

describe('CluesCommand', () => {
  let command: CluesCommand = new CluesCommand();
  let evidences = [{ name: 'evidence1', short_name: 'E1' }, { name: 'evidence2', short_name: 'E2' }, { name: 'evidence3', short_name: 'E3' } ]

  Evidences.all = jest.fn().mockReturnValue(evidences);
  Evidences.givenBy = jest.fn().mockReturnValue(evidences);
  GhostTypes.thatGive = jest.fn().mockReturnValue([{ name: 'ghost1', advice: 'an advice' }]);

  test('it should be named "clues" ',() =>{
    expect(command.name).toBe('clues');
  })

  test('it should have one paremeter named "clueList" ',() =>{
    expect(command.parameters.length).toBe(1);
    expect(command.parameters[0]).toBe('clueList');
  })

  describe('getDescription', () => {
    test('it should enumerate all available clues', async () => {
      let desciption = await command.getDescription();
      expect(desciption.prettyPrint()).toBe(
      `Given a space separated set of evidences, I will tell you all possible ghost types that you could be dealing with. The evidence can be any of the following, you may use its short name (which is shown between paranthesis):\n\t ■ Evidence1 (*E1*)\n\t ■ Evidence2 (*E2*)\n\t ■ Evidence3 (*E3*)\n`);
    });
  })

  describe('exec', () => {
    test('it should tell you tu try again if it is called without args', async () => {
      let reply = await command.exec([]);
      expect(reply).toBe('Dale forr@, conseguí una pista (o mejor dos) antes de pedirme ayuda.');
    });

    test('it should give you a list of posible ghosts with the missing evidence', async () => {
      let reply = await command.exec(['E1']) as MessageEmbed;
      expect(reply.title).toBe('Bueh, una pista nomás?... Aca tenes una lista de lo que podria ser :rolling_eyes:');
      expect(reply.fields.length).toBe(6);
      expect(reply.fields[0].name).toBe('Ghost');
      expect(reply.fields[1].name).toBe('Missing Evidence 0');
      expect(reply.fields[2].name).toBe('Missing Evidence 1');
      expect(reply.fields[3].value).toBe('*Ghost1*');
      expect(reply.fields[4].value).toBe('*Evidence2*');
      expect(reply.fields[5].value).toBe('*Evidence3*');
    })

    test('it should give detail information of posibble ghost if more than two evidences are provided', async () => {
      let reply = await command.exec(['E1', 'E2']) as MessageEmbed;
      expect(reply.title).toBe('Posibles ghosts');
      expect(reply.description).toBe('Given the clues you gave me, the ghost can be one of the following:');
      expect(reply.fields[0].name).toBe('GHOST1');
      expect(reply.fields[0].value).toBe('an advice');
      expect(reply.fields[1].name).toBe('Missing Evidence');
      expect(reply.fields[1].value).toBe('Evidence3');
    })

    test('it should tell you there are no missing evidence if three evidences are provided', async () => {
      let reply = await command.exec(['E1', 'E2', 'E3']) as MessageEmbed;
      expect(reply.title).toBe('Posibles ghosts');
      expect(reply.description).toBe('Given the clues you gave me, the ghost can be one of the following:');
      expect(reply.fields[0].name).toBe('GHOST1');
      expect(reply.fields[0].value).toBe('an advice');
      expect(reply.fields[1].name).toBe('Missing Evidence');
      expect(reply.fields[1].value).toBe('None');
    })
  })
});