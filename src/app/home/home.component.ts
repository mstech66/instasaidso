import { Component, OnInit, ComponentRef, ComponentFactoryResolver, ViewContainerRef, ViewChild } from '@angular/core';
import { InstaService } from '../insta.service';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('viewContainerRef', { read: ViewContainerRef })
  VCR: ViewContainerRef;

  reachedEnd = false;

  componentRefs = Array<ComponentRef<CardComponent>>();

  constructor(private instaService: InstaService, private CFR: ComponentFactoryResolver) {
    instaService.getPosts(4).subscribe((data) => {
      data.forEach(element => {
        this.createCard(element);
      });
    });
  }

  ngOnInit() {
    window.addEventListener('scroll', this.scroll, true);
  }

  createCard(post) {
    const componentFactory = this.CFR.resolveComponentFactory(CardComponent);
    const childComponentRef = this.VCR.createComponent(componentFactory);
    const childComponent = childComponentRef.instance;
    childComponent.post = post;
    this.componentRefs.push(childComponentRef);
  }

  scroll = (event) => {
    if (window.innerHeight + window.scrollY === document.body.scrollHeight) {
      console.log('reached the end');
      if (this.reachedEnd === false) {
        this.instaService.getPosts(2).subscribe((data) => {
          if (data.length === 0) {
            console.log('reached the end finally');
          } else {
            data.forEach(element => {
              this.createCard(element);
            });
          }
        });
      } else {
        console.log('finally reached the end');
      }
    }
  }

}
