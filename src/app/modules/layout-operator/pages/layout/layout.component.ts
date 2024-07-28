import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IUserAdmin } from 'src/app/models/user-admin.model';
import { AuthService } from 'src/app/services/auth.service';
import { DocumentHistoryService } from 'src/app/services/document-history.service';
import { EventService } from 'src/app/services/event.service';
import { QuorumReadingService } from 'src/app/services/quorum-reading.service';
import { StompService } from 'src/app/services/stomp.service';
import { TicketService } from 'src/app/services/ticket.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

  user: IUserAdmin | null = null;
  token: string = '';
  eventCode: number = 0;
  isAdmin: boolean = false;
  isAdminOperator: boolean = false;
  showOptions: boolean = false;
  subscription: Subscription;
  subscriptionCharge: Subscription;
  subscriptionTicket: Subscription;
  isOpen: boolean = false;
  isOpenMenu: boolean = false;

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router,
    private route: ActivatedRoute,
    private eventService: EventService,
    private stompService: StompService,
    private ticketService: TicketService,
    private documentHistoryService: DocumentHistoryService,
    private quorumReadingService: QuorumReadingService,
  ) {
    this.route.queryParamMap.subscribe(params => {
      const eventCode = params.get('eventCode');
      if (eventCode) {
        const newEventCode = Number(eventCode);
        if (this.eventCode === 0) {
          if (this.eventCode !== newEventCode) {
            this.eventCode = newEventCode;
            this.eventService.getByCode(this.eventCode).subscribe({
              next: (data) => {
                if (data.payload) {
                  this.eventService.event$.next(data.payload);
                  if (data.payload.event.status === 0) {
                    const queryParams = {
                      eventCode: Number(this.eventCode),
                    };
                    this.router.navigate(['punto-registro-operador/cerrado'], { queryParams: queryParams })
                  } else {
                    if (data.payload.configRegistrationPoint && data.payload.event) {
                      this.showOptions = true;
                    }
                    this.ticketService.getByEvent(data.payload.event.eventId).subscribe({
                      next: (data) => {
                        if (data) {
                          this.eventService.tickets$.next(data.payload);
                        }
                      },
                      error: (error) => {
                        console.error(error);
                      }
                    });
                    this.eventService.getQuorum(data.payload.event.eventId).subscribe({
                      next: (data) => {
                        if (data) {
                          this.eventService.quorum$.next(data.payload);
                        }
                      },
                      error: (error) => {
                        console.error(error);
                      }
                    });
                    this.eventService.getInfoEvent(data.payload.event.eventId, data.payload.event.clientId).subscribe({
                      next: (data) => {
                        if (data) {
                          this.eventService.infoEvent$.next(data.payload);
                        }
                      },
                      error: (error) => {
                        console.error(error);
                      }
                    });
                    this.eventService.getRolesByCliente(data.payload.event.clientId).subscribe({
                      next: (data) => {
                        if (data.status === 'success') {
                          this.eventService.roles$.next(data.payload);
                        }
                      },
                      error: (error) => {
                        console.error(error);
                      }
                    });
                    this.stompService.connect(() => {
                      this.stompService.subscribeToTopic("/topic/showQuorum-" + data.payload.event.eventId, (): any => {
                        this.eventService.getQuorum(data.payload.event.eventId).subscribe({
                          next: (data) => {
                            if (data) {
                              this.eventService.quorum$.next(data.payload);
                            }
                          },
                          error: (error) => {
                            console.error(error);
                          }
                        });
                        this.eventService.getInfoEvent(data.payload.event.eventId, data.payload.event.clientId).subscribe({
                          next: (data) => {
                            if (data) {
                              this.eventService.infoEvent$.next(data.payload);
                            }
                          },
                          error: (error) => {
                            console.error(error);
                          }
                        });
                        this.quorumReadingService.control$.next(1);
                      });
                    });
                    this.subscriptionCharge = this.documentHistoryService.refresh.subscribe(() => {
                      this.ticketService.getByEvent(data.payload.event.eventId).subscribe({
                        next: (data) => {
                          if (data) {
                            this.eventService.tickets$.next(data.payload);
                          }
                        },
                        error: (error) => {
                          console.error(error);
                        }
                      });
                    });
                    this.subscriptionTicket = this.ticketService.refresh.subscribe(() => {
                      this.ticketService.getByEvent(data.payload.event.eventId).subscribe({
                        next: (data) => {
                          if (data) {
                            this.eventService.tickets$.next(data.payload);
                          }
                        },
                        error: (error) => {
                          console.error(error);
                        }
                      });
                    });
                  }
                }
              },
              error: (error) => {
                console.error(error);
              }
            });
            this.subscription = this.eventService.refresh.subscribe(() => {
              this.eventService.getByCode(this.eventCode).subscribe({
                next: (data) => {
                  if (data.payload) {
                    this.eventService.event$.next(data.payload);
                    if (data.payload.configRegistrationPoint && data.payload.event) {
                      this.showOptions = true;
                    }
                    this.ticketService.getByEvent(data.payload.event.eventId).subscribe({
                      next: (data) => {
                        if (data) {
                          this.eventService.tickets$.next(data.payload);
                        }
                      },
                      error: (error) => {
                        console.error(error);
                      }
                    });
                    this.eventService.getQuorum(data.payload.event.eventId).subscribe({
                      next: (data) => {
                        if (data) {
                          this.eventService.quorum$.next(data.payload);
                        }
                      },
                      error: (error) => {
                        console.error(error);
                      }
                    });
                    this.eventService.getInfoEvent(data.payload.event.eventId, data.payload.event.clientId).subscribe({
                      next: (data) => {
                        if (data) {
                          this.eventService.infoEvent$.next(data.payload);
                        }
                      },
                      error: (error) => {
                        console.error(error);
                      }
                    });
                    this.stompService.connect(() => {
                      this.stompService.subscribeToTopic("/topic/showQuorum-" + data.payload.event.eventId, (): any => {
                        this.eventService.getQuorum(data.payload.event.eventId).subscribe({
                          next: (data) => {
                            if (data) {
                              this.eventService.quorum$.next(data.payload);
                            }
                          },
                          error: (error) => {
                            console.error(error);
                          }
                        });
                        this.eventService.getInfoEvent(data.payload.event.eventId, data.payload.event.clientId).subscribe({
                          next: (data) => {
                            if (data) {
                              this.eventService.infoEvent$.next(data.payload);
                            }
                          },
                          error: (error) => {
                            console.error(error);
                          }
                        });
                        this.quorumReadingService.control$.next(1);
                      });
                    });
                    this.subscriptionCharge = this.documentHistoryService.refresh.subscribe(() => {
                      this.ticketService.getByEvent(data.payload.event.eventId).subscribe({
                        next: (data) => {
                          if (data) {
                            this.eventService.tickets$.next(data.payload);
                          }
                        },
                        error: (error) => {
                          console.error(error);
                        }
                      });
                    });
                    this.subscriptionTicket = this.ticketService.refresh.subscribe(() => {
                      this.ticketService.getByEvent(data.payload.event.eventId).subscribe({
                        next: (data) => {
                          if (data) {
                            this.eventService.tickets$.next(data.payload);
                          }
                        },
                        error: (error) => {
                          console.error(error);
                        }
                      });
                    });
                  }
                },
                error: (error) => {
                  console.error(error);
                }
              });
            })
          }
        } 
      }
    });
  }

  ngOnDestroy(): void {
    this.stompService.disconnect();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.subscriptionCharge) {
      this.subscriptionCharge.unsubscribe();
    }
    if (this.subscriptionTicket) {
      this.subscriptionTicket.unsubscribe();
    }
  }

  ngOnInit(): void {
    const token = this.tokenService.getToken();
    if (token) {
      this.token = token;
    }
    this.authService.getProfile(this.token).subscribe({
      next: (data) => {
        if (data) {
          this.user = data.payload;
          this.authService.user$.next(this.user);
          const userRoles = this.user.idRol;
          this.isAdmin = userRoles.includes(1);
          this.isAdminOperator = userRoles.includes(5);
        }
      },
      error: (error) => {
        console.error(error);
      }

    });
  }

  onNavigate(event: Event) {
    event.preventDefault();

  }

  logout() {
    this.authService.user$.next(null);
    this.tokenService.removeToken();
    this.router.navigate(['auth/login']);
  }

  onClient() {
    this.router.navigate(['punto-registro-operador/cliente']);
  }
}
