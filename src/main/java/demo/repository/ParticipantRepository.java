package demo.repository;

import demo.domain.Participant;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

/**
 * Date: 02.02.2015
 * Time: 12:22
 *
 */
@Repository
public interface ParticipantRepository extends PagingAndSortingRepository<Participant, Integer> {
}
