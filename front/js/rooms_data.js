// get with api (sorted by floor num desc)
export var rooms = [
	{
    id: 1,
		name: "first",
    floor_num: 2,
		events: [
			{
  			start: new Date(2018,1,16,18,0,0),
  			end: new Date(2018,1,16,19,0,0),
  			title: 'Event 1'
  		},
  		{
  			start: new Date(2018,1,16,23,0,0),
  			end: new Date(2018,1,17,1,0,0),
  			title: 'Event 2',
  		},
  		{
  			start: new Date(2018,1,17,10,0,0),
  			end: new Date(2018,1,17,13,0,0),
  			title: 'Event 3',
  		},
  		{
  			start: new Date(2018,1,17,15,0,0),
  			end: new Date(2018,1,17,17,0,0),
  			title: 'Event 4',
  		}
		],
	},
	{
		name: "special",
		id: 2,
    floor_num: 2,
		events: [
			{
				start: new Date(2018,1,18,14,0,0),
				end: new Date(2018,1,18,23,0,0),
				title: 'Special event'
			}
		]
	},
	{
		name: "second",
		id: 3,
    floor_num: 1,
		events: [
			{
				start: new Date(2018,1,16,22,20,0),
  			end: new Date(2018,1,16,23,0,0),
  			title: 'useless event'
  		},
  		{
  			start: new Date(2018,1,16,23,0,0),
  			end: new Date(2018,1,17,1,50,0),
  			title: 'simple event'
  		}
		]
	},
  {
    name: "new",
    id: 4,
    floor_num: 2,
    events: [
      {
        start: new Date(2018,1,16,22,20,0),
        end: new Date(2018,1,16,23,0,0),
        title: 'useless event'
      },
      {
        start: new Date(2018,1,16,23,0,0),
        end: new Date(2018,1,17,1,50,0),
        title: 'simple event'
      }
    ]
  },
  {
    name: "new",
    id: 5,
    floor_num: 1,
    events: [
      {
        start: new Date(2018,1,16,22,20,0),
        end: new Date(2018,1,16,23,0,0),
        title: 'useless event'
      },
      {
        start: new Date(2018,1,16,23,0,0),
        end: new Date(2018,1,17,1,50,0),
        title: 'simple event'
      }
    ]
  },
  {
    name: "new",
    id: 6,
    floor_num: 0,
    events: [
      {
        start: new Date(2018,1,16,22,20,0),
        end: new Date(2018,1,16,23,0,0),
        title: 'useless event'
      },
      {
        start: new Date(2018,1,16,23,0,0),
        end: new Date(2018,1,17,1,50,0),
        title: 'simple event'
      }
    ]
  },
  {
    name: "new",
    id: 7,
    floor_num: 0,
    events: [
      {
        start: new Date(2018,1,16,22,20,0),
        end: new Date(2018,1,16,23,0,0),
        title: 'useless event'
      },
      {
        start: new Date(2018,1,16,23,0,0),
        end: new Date(2018,1,17,1,50,0),
        title: 'simple event'
      }
    ]
  },
  {
    name: "new",
    id: 8,
    floor_num: 23,
    events: [
      {
        start: new Date(2018,1,16,22,20,0),
        end: new Date(2018,1,16,23,0,0),
        title: 'useless event'
      },
      {
        start: new Date(2018,1,16,23,0,0),
        end: new Date(2018,1,17,1,50,0),
        title: 'simple event'
      }
    ]
  },
  {
    name: "new",
    id: 9,
    floor_num: 22,
    events: [
      {
        start: new Date(2018,1,16,22,20,0),
        end: new Date(2018,1,16,23,0,0),
        title: 'useless event'
      },
      {
        start: new Date(2018,1,16,23,0,0),
        end: new Date(2018,1,17,1,50,0),
        title: 'simple event'
      }
    ]
  },
  {
    name: "new",
    id: 10,
    floor_num: 21,
    events: [
      {
        start: new Date(2018,1,16,22,20,0),
        end: new Date(2018,1,16,23,0,0),
        title: 'useless event'
      },
      {
        start: new Date(2018,1,16,23,0,0),
        end: new Date(2018,1,17,1,50,0),
        title: 'simple event'
      }
    ]
  },
  {
    name: "new",
    id: 11,
    floor_num: 20,
    events: [
      {
        start: new Date(2018,1,16,22,20,0),
        end: new Date(2018,1,16,23,0,0),
        title: 'useless event'
      },
      {
        start: new Date(2018,1,16,23,0,0),
        end: new Date(2018,1,17,1,50,0),
        title: 'simple event'
      }
    ]
  },
  {
    name: "new",
    id: 12,
    floor_num: 19,
    events: [
      {
        start: new Date(2018,1,16,22,20,0),
        end: new Date(2018,1,16,23,0,0),
        title: 'useless event'
      },
      {
        start: new Date(2018,1,16,23,0,0),
        end: new Date(2018,1,17,1,50,0),
        title: 'simple event'
      }
    ]
  },
  {
    name: "new",
    id: 13,
    floor_num: 18,
    events: [
      {
        start: new Date(2018,1,16,22,20,0),
        end: new Date(2018,1,16,23,0,0),
        title: 'useless event'
      },
      {
        start: new Date(2018,1,16,23,0,0),
        end: new Date(2018,1,17,1,50,0),
        title: 'simple event'
      }
    ]
  },
  {
    name: "new",
    id: 14,
    floor_num: 2,
    events: [
      {
        start: new Date(2018,1,16,22,20,0),
        end: new Date(2018,1,16,23,0,0),
        title: 'useless event'
      },
      {
        start: new Date(2018,1,16,23,0,0),
        end: new Date(2018,1,17,1,50,0),
        title: 'simple event'
      }
    ]
  },
];