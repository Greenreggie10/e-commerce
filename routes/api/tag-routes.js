const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags
  Tag.findAll({
    attributes: [
      'id',
      'tag_name'
    ],
    include: [
      {
        model: Product,
        attributes: ['product_name'],
        through: ProductTag,
        as: 'tagged_products'
      }
    ]
  })
  .then(tags => {
    if (!tags) {
      res.status(404).json({ message: 'No tags found.'})
    } else {
      res.json(tags);
    };
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
  // be sure to include its associated Product data
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  Tag.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'tag_name'
    ],
    include: [
      {
        model: Product,
        attributes: ['product_name'],
        through: ProductTag,
        as: 'tagged_products'
      }
    ]
  })
  .then(tag => {
    if (!tag) {
      res.status(404).json({ message: 'No tag found with this ID.'});
    } else {
      res.json(tag);
    };
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
  // be sure to include its associated Product data
});

router.post('/', (req, res) => {
  // create a new tag
  Tag.create({
    tag_name: req.body.tag_name
  })
  .then(newTag => res.json(newTag))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update( req.body, {
    where: {
      id: req.params.id
    }
  })
  .then((tagData) => {
    // get updated row
    return Tag.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        'id',
        'tag_name'
      ],
      include: [
        {
          model: Product,
          attributes: ['product_name'],
          through: ProductTag,
          as: 'tagged_products'
        }
      ]
    })
  })
  .then(updatedTag => res.json(updatedTag))
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });

});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(tagData => {
    if (!tagData) {
      res.status(404).json({ message: 'No tag found with this ID.'});
    } else {
      res.json(tagData);
    };
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });

});

module.exports = router;
