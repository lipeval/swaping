import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { LazyLoadEvent } from 'primeng/primeng';
import { Film } from '../../models/film.model';
import { ItemListBase } from '../item-list-base';

@Component({
  selector: 'app-item-list-film',
  templateUrl: './item-list-film.component.html',
  styleUrls: ['./item-list-film.component.css']
})
export class ItemListFilmComponent extends ItemListBase {
  public loadData: Film[];
  public mainUrl = 'films';
  /**
   *Aggancio un observer ai paramtri ricevuti in path, ogni volta che cambiano effettuo un caricamento diverso per la prima pagina almeno
   * @param {ApiService} apiService
   * @param {ActivatedRoute} route
   * @memberof ItemListComponent
   */
  constructor(private apiService: ApiService, private route: ActivatedRoute) {
    super();
  }

  /**
   *Caricamento e configurazione tabella principale
   *
   * @public
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
    this.apiService.getUrlPages(this.currentPage, this.mainUrl).then(data => {
      data.results.forEach(d => this.apiService.elaborateLookup(d));

      this.loadData = data.results;

      this.totalRecords = data.count;
      this.loading = false;
    });
  }
}
