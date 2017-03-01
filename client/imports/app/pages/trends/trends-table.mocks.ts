import  { Table } from './table.model'; 	//importo la classe MenuItem così posso usarla qui dentro

import { WeatherSamps } from '../../../../../both/collections/weather-samps.collection';
import { Studio, Sala, Bagno, Cucina, Ingresso, ZonaNotte } from '../../../../../both/collections/zones.collection';


export const TABLE: Table[] = [				//esporto un oggetto costante di tipo MenuItem[] che si chiama MENUITEM che contiene
		{									//tutte le proprietà degli item del menu di navigazione.
			Name: "Studio",
			Collection: Studio
		},
		{
			Name: "Sala",
			Collection: Sala
		},
		{
			Name: "Bagno",
			Collection: Bagno
		},
		{
			Name: "Cucina",
			Collection: Cucina
		},
		{
			Name: "Ingresso",
			Collection: Ingresso
		},
		{
			Name: "Zona Notte",
			Collection: ZonaNotte
		},
		{
			Name: "Stazione Meteo",
			Collection: WeatherSamps
		}
	]