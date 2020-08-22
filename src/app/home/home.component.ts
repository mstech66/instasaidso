import { Component, OnInit } from '@angular/core';
import { InstaService } from '../insta.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  postArray = [];

  // tslint:disable-next-line: max-line-length
  svgLike = 'M 34.6 6.1 c 5.7 0 10.4 5.2 10.4 11.5 c 0 6.8 -5.9 11 -11.5 16 S 25 41.3 24 41.9 c -1.1 -0.7 -4.7 -4 -9.5 -8.3 c -5.7 -5 -11.5 -9.2 -11.5 -16 C 3 11.3 7.7 6.1 13.4 6.1 c 4.2 0 6.5 2 8.1 4.3 c 1.9 2.6 2.2 3.9 2.5 3.9 c 0.3 0 0.6 -1.3 2.5 -3.9 c 1.6 -2.3 3.9 -4.3 8.1 -4.3 m 0 -3 c -4.5 0 -7.9 1.8 -10.6 5.6 c -2.7 -3.7 -6.1 -5.5 -10.6 -5.5 C 6 3.1 0 9.6 0 17.6 c 0 7.3 5.4 12 10.6 16.5 c 0.6 0.5 1.3 1.1 1.9 1.7 l 2.3 2 c 4.4 3.9 6.6 5.9 7.6 6.5 c 0.5 0.3 1.1 0.5 1.6 0.5 c 0.6 0 1.1 -0.2 1.6 -0.5 c 1 -0.6 2.8 -2.2 7.8 -6.8 l 2 -1.8 c 0.7 -0.6 1.3 -1.2 2 -1.7 C 42.7 29.6 48 25 48 17.6 c 0 -8 -6 -14.5 -13.4 -14.5 Z';
  // tslint:disable-next-line: max-line-length
  svgUnlike = 'M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z';

  constructor(private instaService: InstaService) {
    instaService.getData().then((data) => {
      this.postArray = data;
    });
  }

  ngOnInit() {
  }

  like(button, svg, path) {
    button.style.animation = '';
    button.style.animation = 'unlike 100ms ease-out 2 alternate';
    path.setAttribute('d', this.svgUnlike);
    svg.setAttribute('fill', '#ed4956');
    svg.setAttribute('aria-label', 'Unlike');
  }

  unlike(button, svg, path) {
    button.style.animation = '';
    button.style.animation = 'like 100ms ease-in 2 alternate';
    path.setAttribute('d', this.svgLike);
    svg.setAttribute('fill', '#262626');
    svg.setAttribute('aria-label', 'Like');
  }

  setLikeListener(id) {
    const button = document.getElementById(id);
    const childSvg = button.querySelector('#likesvg');
    const childPath = childSvg.querySelector('#likepath');
    if (childSvg.getAttribute('aria-label') === 'Like') {
      this.like(button, childSvg, childPath);
    } else {
      this.unlike(button, childSvg, childPath);
    }
  }

  setTapListener(id) {
    console.log(`id is ${id}`);
    const heart = document.getElementById(`heart_${id}`);
    heart.classList.add('pound');
    heart.classList.remove('hiddenHeart');
    setTimeout(() => {
      heart.classList.remove('pound');
      heart.classList.add('hiddenHeart');
    }, 800);
    const button = document.getElementById(id);
    const childSvg = button.querySelector('#likesvg');
    const childPath = childSvg.querySelector('#likepath');
    this.like(button, childSvg, childPath);
  }

}
