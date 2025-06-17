import Button from '@/components/common/Button'
import { useTranslation } from 'react-i18next'

const Home = () => {
  const { t } = useTranslation()
  return (
    <div>
      <h1>{t('sidebar.Home')}</h1>
      <Button className='my-5 w-25' primary>
        Home Page
      </Button>
      <p className='text-2xl'>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quam sed
        facilis fuga illo alias laboriosam? Earum atque esse deserunt nihil,
        pariatur mollitia nobis consequatur voluptatibus sequi excepturi tempora
        ab obcaecati!Loremloe Lorem ipsum dolor sit, amet consectetur
        adipisicing elit. Sapiente pariatur at non ullam quae inventore. Ex
        consequuntur necessitatibus voluptates dolorem, modi quod totam adipisci
        tempore culpa eligendi consequatur quos asperiores. Lorem, ipsum dolor
        sit amet consectetur adipisicing elit. Dolore dignissimos quas optio
        consequuntur officiis totam vero. Omnis nesciunt praesentium saepe
        reiciendis maxime, unde voluptatem cupiditate deleniti, pariatur
        exercitationem magnam expedita! Lorem ipsum dolor, sit amet consectetur
        adipisicing elit. Voluptate, doloremque debitis recusandae quam
        voluptates placeat maxime sint facilis nisi ipsam, nemo vero quibusdam
        tenetur error possimus velit nostrum? Ex, inventore. Lorem ipsum dolor
        sit amet consectetur adipisicing elit. Dolorem veritatis ratione
        corporis dignissimos, voluptatum at, vitae rerum exercitationem quidem
        nam unde, nesciunt neque excepturi maiores quas ducimus similique error
        voluptatibus. Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Porro fuga corrupti molestias quia non dolorem officiis maxime vitae
        culpa voluptatum iste atque, optio fugit consequuntur iusto nemo
        veritatis voluptates molestiae? Lorem, ipsum dolor sit amet consectetur
        adipisicing elit. Blanditiis tenetur deserunt alias, ad accusamus
        praesentium corporis placeat facilis aperiam ratione mollitia aliquid
        aut recusandae similique sed! Tenetur blanditiis nemo reiciendis? Lorem
        ipsum dolor sit amet consectetur adipisicing elit. Distinctio aperiam,
        culpa asperiores aliquam esse illo dignissimos fugiat facere suscipit
        reprehenderit ipsa quia vero numquam necessitatibus similique eaque modi
        exercitationem quasi? Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Excepturi quisquam error magni ut, praesentium inventore maiores
        cumque at eaque ratione quaerat, velit maxime vero dolor cum libero
        doloribus ullam. Alias?
      </p>
    </div>
  )
}
export default Home
