/*
		Qui si inizia a vedere la vera potenzialità di TypeScript.
		Grazie a TypeScript ho potuto creare una classe che definisce
		un "tipo", in questo caso il tipo MenuItem, che prevede tre
		attributi: name, description e path. Per costruire un oggetto
		di tipo MenuItem è obbligatorio definire tutti e tre gli attributi.
		Questo permette un migliore controllo dei dati.
*/

export class MenuItem {
	name: string;
	description: string;
	path: string;
	isActive: boolean
}