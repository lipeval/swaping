import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { LazyLoadEvent } from 'primeng/primeng';
import { People } from '../../models/people.model';

import { StartShipFields } from '../../models/starship.model';
import { VehicleFields } from '../../models/vehicle.model';
import { FilmFields } from '../../models/film.model';

@Component({
  selector: 'app-item-list-people',
  templateUrl: './item-list-people.component.html',
  styleUrls: ['./item-list-people.component.css']
})
export class ItemListPeopleComponent implements OnInit {
  public loadData: People[];

  public totalRecords: number;
  public loading = true;
  public currentPage = 1;

  /**
   * Gestione della modal con le specifiche dell'object
   *
   * @memberof ItemListPeopleComponent
   */
  public modalItem;
  public displayModalDetail = false;
  public modalType: string;

  /**
   *Aggancio un observer ai paramtri ricevuti in path, ogni volta che cambiano effettuo un caricamento diverso per la prima pagina almeno
   * @param {ApiService} apiService
   * @param {ActivatedRoute} route
   * @memberof ItemListComponent
   */
  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {}

  /**
   *Caricamento e configurazione tabella principale
   *
   * @private
   * @memberof ItemListComponent
   */
  public loadDataAndConfigureTable(event: LazyLoadEvent) {
    this.currentPage = event.first / event.rows;
    if (this.currentPage === 0) {
      this.currentPage = 1;
    } else {
      this.currentPage++;
    }
    this.loading = true;
    this.apiService.getUrlPages(this.currentPage, 'people').then(data => {
      data.results.forEach(item => {
        this.apiService.getLookUpList(item.starships, (item.starshipsObj = []));
        this.apiService.getLookUpList(item.films, (item.filmsObj = []));
        this.apiService.getLookUpList(item.species, (item.speciesObj = []));
        this.apiService.getLookUpList(item.vehicles, (item.vehiclesObj = []));

        item.homeworldObj = this.apiService.getLookUp(item.homeworld);
      });

      this.loadData = data.results;

      this.totalRecords = data.count;
      this.loading = false;
    });
  }

  /**
   *Reseta la modal sull'evento di chiusura dello stesso
   *
   * @param {Event} Event
   * @memberof ItemListPlanetComponent
   */
  public resetModal(Event: Event) {
    this.displayModalDetail = false;
    this.modalItem = null;
    this.modalType = null;
  }

  /**
   * Visualizza la modale con le info dell'object richiesto
   *
   * @param {*} item
   * @param {string} type
   * @memberof ItemListPlanetComponent
   */
  public displayModalPannel(item: any, type: string) {
    this.displayModalDetail = true;
    this.modalItem = item;
    this.modalType = type;
  }
}