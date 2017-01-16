import  { MenuItem } from './menu-item-model'; 	//importo la classe MenuItem così posso usarla qui dentro

export const MENUITEMS: MenuItem[] = [		//esporto un oggetto costante di tipo MenuItem[] che si chiama MENUITEM che contiene
		{									//tutte le proprietà degli item del menu di navigazione.
			name: "Trends",
			description: "Some graphs about various things",
			path: "trends",
			isActive: true
		},
		{
			name: "Controller",
			description: "The button room",
			path: "controller",
			isActive: false
		},
		{
			name: "Water Plant",
			description: "This is where is represented the schema of the Water Treatement Plant; with heating, distributing, ecc.",
			path: "waterplant",
			isActive: false
		},
		{
			name: "Docs",
			description: "Home Docs Here!",
			path: "docs",
			isActive: false
		}
	]
